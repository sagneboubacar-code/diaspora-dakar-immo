#!/usr/bin/env bash
# Monte la vidéo de fond du Hero de l'accueil à partir des images réelles de
# finition du chantier 1 : uniquement la façade livrée, au crépuscule et de
# jour. L'intérieur est réservé à la partie Réalisations.
#
# Aucune image de banque, ni terrain ni gros œuvre : seulement la villa
# terminée. Deux sortes de plans, enchaînés en fondu :
#   - photo : une photo animée par un mouvement de caméra lent (zoom ou
#     travelling) ;
#   - clip  : un extrait des vidéos WhatsApp filmées par l'agence autour de la
#     façade.
#
# Deux cadrages, car les images sont toutes en portrait :
#   public/hero/hero-portrait.mp4   720x1280 — téléphones
#   public/hero/hero-paysage.mp4   1280x720  — écrans larges
# Le point focal de chaque plan décide quelle partie de l'image reste dans
# le cadre quand on recadre.
#
# Les photos sont dans public/hero/ (elles servent aussi de diaporama de
# secours) : finition-* au crépuscule, facade-jour-* de jour. Les vidéos
# sources restent dans « NOUVELLES IMAGE CHANTIER 1/ », dossier local non
# versionné, comme les autres médias bruts de l'agence.
#
# Usage : ./scripts/build-hero-video.sh   (nécessite ffmpeg)
set -euo pipefail
cd "$(dirname "$0")/.."

FPS=30
FADE=0.8      # fondu enchaîné entre deux plans (s)
END_FADE=0.8  # fondu au noir avant que la boucle reparte (s)
CRF=28        # 18 = quasi sans perte, 28 = léger ; le Hero est sous un voile sombre

SRC="NOUVELLES IMAGE CHANTIER 1"
CLIP_PAN="$SRC/WhatsApp Video 2026-10-24.mp4"           # balayage de la façade
CLIP_WALK="$SRC/WhatsApp Video 2026-10-24 at 00.39.17.mp4" # approche à pied

# photo | image | durée (s) | mouvement (in, out, left, right, up, down) | focal x | focal y
# clip  | vidéo | début (s) | durée (s) | focal x | focal y
# On ouvre et on ferme sur la façade de face au crépuscule, lumières
# allumées. La caméra longe la façade, la prend de biais et en fait le tour ;
# au milieu, les trois photos de jour se suivent pour ne pas alterner jour et
# nuit à chaque plan. Les extraits couvrent presque toute la durée utile des
# deux vidéos (on coupe le passage où la maison voisine en chantier entre
# dans le cadre).
SHOTS=(
  "photo|public/hero/finition-01.jpg|4.0|in|0.50|0.45"
  "clip|$CLIP_PAN|0.4|5.8|0.50|0.45"
  "photo|public/hero/finition-02.jpg|3.8|in|0.50|0.40"
  "clip|$CLIP_WALK|0.5|5.5|0.50|0.40"
  "photo|public/hero/finition-03.jpg|3.8|up|0.50|0.35"
  "clip|$CLIP_PAN|6.2|4.8|0.50|0.45"
  "photo|public/hero/facade-jour-01.jpg|3.6|in|0.50|0.40"
  "photo|public/hero/facade-jour-02.jpg|3.6|left|0.50|0.35"
  "photo|public/hero/facade-jour-03.jpg|3.6|out|0.50|0.35"
  "clip|$CLIP_WALK|9.0|4.6|0.50|0.40"
  "clip|$CLIP_PAN|12.6|5.2|0.50|0.45"
  "photo|public/hero/finition-04.jpg|5.0|out|0.50|0.45"
)

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p public/hero

frames_of() { awk -v d="$1" -v f="$FPS" 'BEGIN { printf "%d", d * f }'; }

render() {
  local width=$1 height=$2 out=$3
  # Suréchantillonnage x2 avant le zoompan : il arrondit sa fenêtre au pixel,
  # ce qui fait trembler l'image ; à 2x, l'arrondi disparaît à la réduction.
  local sw=$((width * 2)) sh=$((height * 2))
  local inputs=() durations=() i=0

  for shot in "${SHOTS[@]}"; do
    IFS='|' read -r kind source a b c d <<< "$shot"
    if [[ $kind == photo ]]; then
      local duration=$a motion=$b fx=$c fy=$d frames zoom x y
      frames=$(frames_of "$duration")
      case $motion in
        in)    zoom="1+0.10*on/$frames" ;  x="(iw-iw/zoom)/2" ;                    y="(ih-ih/zoom)/2" ;;
        out)   zoom="1.10-0.10*on/$frames" ; x="(iw-iw/zoom)/2" ;                  y="(ih-ih/zoom)/2" ;;
        right) zoom="1.12" ;               x="(iw-iw/zoom)*on/$frames" ;           y="(ih-ih/zoom)/2" ;;
        left)  zoom="1.12" ;               x="(iw-iw/zoom)*(1-on/$frames)" ;       y="(ih-ih/zoom)/2" ;;
        up)    zoom="1.12" ;               x="(iw-iw/zoom)/2" ;                    y="(ih-ih/zoom)*(1-on/$frames)" ;;
        down)  zoom="1.12" ;               x="(iw-iw/zoom)/2" ;                    y="(ih-ih/zoom)*on/$frames" ;;
      esac
      ffmpeg -nostdin -loglevel error -y -i "$source" -vf "\
scale=${sw}:${sh}:force_original_aspect_ratio=increase:flags=lanczos,\
crop=${sw}:${sh}:(iw-${sw})*${fx}:(ih-${sh})*${fy},\
zoompan=z='${zoom}':x='${x}':y='${y}':d=${frames}:s=${width}x${height}:fps=${FPS},\
format=yuv420p" -frames:v "$frames" -c:v libx264 -preset veryfast -crf 12 "$tmp/shot-$i.mp4"
    else
      # Les vidéos WhatsApp font 478x850 : en paysage, la bande recadrée est
      # agrandie près de 3 fois, d'où un léger renfort de netteté.
      local start=$a duration=$b fx=$c fy=$d frames
      frames=$(frames_of "$duration")
      ffmpeg -nostdin -loglevel error -y -ss "$start" -i "$source" -vf "\
fps=${FPS},\
scale=${width}:${height}:force_original_aspect_ratio=increase:flags=lanczos,\
crop=${width}:${height}:(iw-${width})*${fx}:(ih-${height})*${fy},\
unsharp=5:5:0.5:5:5:0,setsar=1,format=yuv420p" -frames:v "$frames" -an -c:v libx264 -preset veryfast -crf 12 "$tmp/shot-$i.mp4"
    fi
    inputs+=(-i "$tmp/shot-$i.mp4")
    durations+=("$duration")
    i=$((i + 1))
  done

  # Chaîne de fondus : le plan k entre à (somme des durées précédentes - k fondus).
  local graph="" previous="[0:v]" offset=${durations[0]} k total fade_start
  for ((k = 1; k < ${#durations[@]}; k++)); do
    offset=$(awk -v o="$offset" -v f="$FADE" 'BEGIN { printf "%.3f", o - f }')
    graph+="${previous}[${k}:v]xfade=transition=fade:duration=${FADE}:offset=${offset}[v${k}];"
    previous="[v${k}]"
    offset=$(awk -v o="$offset" -v d="${durations[$k]}" 'BEGIN { printf "%.3f", o + d }')
  done
  total=$offset
  fade_start=$(awk -v t="$total" -v f="$END_FADE" 'BEGIN { printf "%.3f", t - f }')
  graph+="${previous}fade=t=out:st=${fade_start}:d=${END_FADE}[out]"

  ffmpeg -nostdin -loglevel error -y "${inputs[@]}" -filter_complex "$graph" -map "[out]" \
    -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -profile:v high \
    -movflags +faststart -an "$out"
  printf '%8s  %s (%ss)\n' "$(du -h "$out" | cut -f1)" "$out" "$total"
}

render 720 1280 "${1:-public/hero}/hero-portrait.mp4"
render 1280 720 "${1:-public/hero}/hero-paysage.mp4"
