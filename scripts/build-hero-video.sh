#!/usr/bin/env bash
# Monte la vidéo de fond du Hero de l'accueil à partir des photos réelles de
# l'agence : terrain → gros œuvre → finitions → villa livrée.
#
# Aucune image de banque : chaque plan est une photo de chantier fournie par
# l'agence, animée par un mouvement de caméra lent (zoom ou travelling) et
# enchaînée en fondu. Tous les plans sauf le premier sont le même chantier
# (chantier 1) ; le terrain du plan 1 en est un autre, comme sur la version
# photo du Hero.
#
# Deux cadrages, car les photos sont presque toutes en portrait :
#   public/hero/hero-portrait.mp4   720x1280 — téléphones
#   public/hero/hero-paysage.mp4   1280x720  — écrans larges
# Le point focal de chaque plan décide quelle partie de la photo reste dans
# le cadre quand on recadre (les lustres sont en haut de l'image, par ex.).
#
# Le script affiche à la fin l'instant où commence chaque étape : ce sont les
# valeurs `videoStartS` de HERO_PHASES (src/app/page.tsx).
#
# Usage : ./scripts/build-hero-video.sh   (nécessite ffmpeg)
set -euo pipefail
cd "$(dirname "$0")/.."

FPS=30
FADE=0.8      # fondu enchaîné entre deux plans (s)
END_FADE=0.8  # fondu au noir avant que la boucle reparte (s)
CRF=28        # 18 = quasi sans perte, 28 = léger ; le Hero est sous un voile sombre

# image | durée (s) | mouvement (in, out, left, right, up, down) | focal x | focal y | étape
# La façade suit toute sa progression (finition → peinte → livrée, de biais
# puis de face) ; l'intérieur fait la visite : entrée, séjour et ses trois
# lustres, baie vitrée, chambre, salle d'eau.
SHOTS=(
  "public/biens/terrain-kounoune-2/photo-01.jpg|3.5|in|0.50|0.50|01"
  "public/realisations/chantier-1/photo-01.jpg|3.0|in|0.50|0.50|02"
  "public/realisations/chantier-1/photo-06.jpg|3.0|out|0.50|0.55|"
  "public/realisations/chantier-1/photo-08.jpg|3.2|up|0.50|0.40|03"
  "public/hero-villa.jpg|3.5|in|0.50|0.40|"
  "public/realisations/chantier-1/photo-29.jpg|3.2|in|0.50|0.30|"
  "public/realisations/chantier-1/photo-31.jpg|3.4|right|0.50|0.15|"
  "public/realisations/chantier-1/photo-32.jpg|3.4|down|0.50|0.12|"
  "public/realisations/chantier-1/photo-33.jpg|3.2|left|0.50|0.15|"
  "public/realisations/chantier-1/photo-34.jpg|3.4|in|0.50|0.15|"
  "public/realisations/chantier-1/photo-35.jpg|3.0|right|0.50|0.25|"
  "public/realisations/chantier-1/photo-37.jpg|3.0|in|0.50|0.30|"
  "public/hero/facade-livree-biais.jpg|4.0|in|0.50|0.35|04"
  "public/realisations/chantier-1/photo-28.jpg|6.0|in|0.50|0.35|"
)

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p public/hero

render() {
  local width=$1 height=$2 out=$3
  # Suréchantillonnage x2 avant le zoompan : il arrondit sa fenêtre au pixel,
  # ce qui fait trembler l'image ; à 2x, l'arrondi disparaît à la réduction.
  local sw=$((width * 2)) sh=$((height * 2))
  local inputs=() i=0

  for shot in "${SHOTS[@]}"; do
    IFS='|' read -r image duration motion fx fy _ <<< "$shot"
    local frames
    frames=$(awk -v d="$duration" -v f="$FPS" 'BEGIN { printf "%d", d * f }')
    local zoom x y
    case $motion in
      in)    zoom="1+0.10*on/$frames" ;  x="(iw-iw/zoom)/2" ;                    y="(ih-ih/zoom)/2" ;;
      out)   zoom="1.10-0.10*on/$frames" ; x="(iw-iw/zoom)/2" ;                  y="(ih-ih/zoom)/2" ;;
      right) zoom="1.12" ;               x="(iw-iw/zoom)*on/$frames" ;           y="(ih-ih/zoom)/2" ;;
      left)  zoom="1.12" ;               x="(iw-iw/zoom)*(1-on/$frames)" ;       y="(ih-ih/zoom)/2" ;;
      up)    zoom="1.12" ;               x="(iw-iw/zoom)/2" ;                    y="(ih-ih/zoom)*(1-on/$frames)" ;;
      down)  zoom="1.12" ;               x="(iw-iw/zoom)/2" ;                    y="(ih-ih/zoom)*on/$frames" ;;
    esac
    ffmpeg -nostdin -loglevel error -y -i "$image" -vf "\
scale=${sw}:${sh}:force_original_aspect_ratio=increase:flags=lanczos,\
crop=${sw}:${sh}:(iw-${sw})*${fx}:(ih-${sh})*${fy},\
zoompan=z='${zoom}':x='${x}':y='${y}':d=${frames}:s=${width}x${height}:fps=${FPS},\
format=yuv420p" -frames:v "$frames" -c:v libx264 -preset veryfast -crf 12 "$tmp/shot-$i.mp4"
    inputs+=(-i "$tmp/shot-$i.mp4")
    i=$((i + 1))
  done

  # Chaîne de fondus : le plan k entre à (somme des durées précédentes - k fondus).
  local graph="" previous="[0:v]" offset=0 k=1 total
  IFS='|' read -r _ first_duration _ <<< "${SHOTS[0]}"
  offset=$first_duration
  for shot in "${SHOTS[@]:1}"; do
    IFS='|' read -r _ duration _ <<< "$shot"
    offset=$(awk -v o="$offset" -v f="$FADE" 'BEGIN { printf "%.3f", o - f }')
    graph+="${previous}[${k}:v]xfade=transition=fade:duration=${FADE}:offset=${offset}[v${k}];"
    previous="[v${k}]"
    offset=$(awk -v o="$offset" -v d="$duration" 'BEGIN { printf "%.3f", o + d }')
    k=$((k + 1))
  done
  total=$offset
  local fade_start
  fade_start=$(awk -v t="$total" -v f="$END_FADE" 'BEGIN { printf "%.3f", t - f }')
  graph+="${previous}fade=t=out:st=${fade_start}:d=${END_FADE}[out]"

  ffmpeg -nostdin -loglevel error -y "${inputs[@]}" -filter_complex "$graph" -map "[out]" \
    -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -profile:v high \
    -movflags +faststart -an "$out"
  printf '%8s  %s (%ss)\n' "$(du -h "$out" | cut -f1)" "$out" "$total"
}

render 720 1280 public/hero/hero-portrait.mp4
render 1280 720 public/hero/hero-paysage.mp4

# Début de chaque étape = milieu du fondu qui fait entrer son premier plan.
echo "Débuts d'étape (videoStartS) :"
start=0 ; k=0
for shot in "${SHOTS[@]}"; do
  IFS='|' read -r _ duration _ _ _ phase <<< "$shot"
  if [ -n "$phase" ]; then
    at=$(awk -v s="$start" -v f="$FADE" -v k="$k" 'BEGIN { printf "%.1f", (k == 0) ? 0 : s + f / 2 }')
    echo "  étape $phase : ${at}s"
  fi
  start=$(awk -v s="$start" -v d="$duration" -v f="$FADE" 'BEGIN { printf "%.3f", s + d - f }')
  k=$((k + 1))
done
