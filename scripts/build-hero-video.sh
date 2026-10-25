#!/usr/bin/env bash
# Monte la vidéo de fond du Hero de l'accueil à partir des images réelles de
# finition du chantier 1 : uniquement la façade livrée, au crépuscule et de
# jour. L'intérieur est réservé à la partie Réalisations.
#
# Aucune image de banque, ni terrain ni gros œuvre : seulement la villa
# terminée. Deux sortes de plans, enchaînés en fondu :
#   - photo : une photo animée par un zoom lent ;
#   - clip  : un extrait des vidéos WhatsApp filmées par l'agence autour de la
#     façade.
#
# Les images sont toutes en hauteur et la villa a trois niveaux : recadrer
# pour remplir l'écran coupait le rez-de-chaussée. Chaque plan montre donc la
# façade entière, du toit au rez-de-chaussée, posée sur un fond flou et
# assombri tiré de la même image, dont elle se détache par des bords fondus.
# Deux cadrages :
#   public/hero/hero-portrait.mp4   720x1280 — téléphones : la façade en haut
#     de l'écran, le bas (sous les boutons) n'est que le fond flou ;
#   public/hero/hero-paysage.mp4   1280x720  — écrans larges : la façade à
#     droite, à côté du texte. HeroShowcase cale cette vidéo en haut à droite
#     pour qu'elle reste entière quel que soit le recadrage.
#
# Les photos sont dans public/hero/ (elles servent aussi de diaporama de
# secours) : finition-* au crépuscule, facade-jour-* de jour. Les vidéos
# sources restent dans « NOUVELLES IMAGE CHANTIER 1/ », dossier local non
# versionné, comme les autres médias bruts de l'agence.
#
# Usage : ./scripts/build-hero-video.sh [dossier de sortie]   (nécessite ffmpeg)
set -euo pipefail
cd "$(dirname "$0")/.."

FPS=30
FADE=0.8      # fondu enchaîné entre deux plans (s)
END_FADE=0.8  # fondu au noir avant que la boucle reparte (s)
CRF=28        # 18 = quasi sans perte, 28 = léger ; le Hero est sous un voile sombre
ZOOM=0.08     # amplitude du zoom lent sur les photos

SRC="NOUVELLES IMAGE CHANTIER 1"
CLIP_PAN="$SRC/WhatsApp Video 2026-10-24.mp4"           # balayage de la façade
CLIP_WALK="$SRC/WhatsApp Video 2026-10-24 at 00.39.17.mp4" # approche à pied

# photo | image | durée (s) | zoom (in, out)
# clip  | vidéo | début (s) | durée (s)
# On ouvre et on ferme sur la façade de face au crépuscule, lumières
# allumées. La caméra longe la façade, la prend de biais et en fait le tour ;
# au milieu, les trois photos de jour se suivent pour ne pas alterner jour et
# nuit à chaque plan. Les extraits couvrent presque toute la durée utile des
# deux vidéos (on coupe le passage où la maison voisine en chantier entre
# dans le cadre).
SHOTS=(
  "photo|public/hero/finition-01.jpg|4.0|in"
  "clip|$CLIP_PAN|0.4|5.8"
  "photo|public/hero/finition-02.jpg|3.8|out"
  "clip|$CLIP_WALK|0.5|5.5"
  "photo|public/hero/finition-03.jpg|3.8|in"
  "clip|$CLIP_PAN|6.2|4.8"
  "photo|public/hero/facade-jour-01.jpg|3.6|out"
  "photo|public/hero/facade-jour-02.jpg|3.6|in"
  "photo|public/hero/facade-jour-03.jpg|3.6|out"
  "clip|$CLIP_WALK|9.0|4.6"
  "clip|$CLIP_PAN|12.6|5.2"
  "photo|public/hero/finition-04.jpg|5.0|out"
)

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p public/hero

frames_of() { awk -v d="$1" -v f="$FPS" 'BEGIN { printf "%d", d * f }'; }
ratio() { awk -v a="$1" -v b="$2" 'BEGIN { printf "%.4f", a / b }'; }

# Fond flou : l'image recadrée plein cadre, très floutée et assombrie.
background() { echo "scale=$1:$2:force_original_aspect_ratio=increase,crop=$1:$2,gblur=sigma=$3,eq=brightness=-0.12:saturation=0.8"; }

# Façade : l'image entière, haute de $1 px, aux bords gauche, droit et bas
# fondus sur $2, $3 et $4 px (le haut reste net, collé au bord du cadre).
facade() {
  echo "scale=-2:$1:flags=lanczos,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*min(1,X/$2)*min(1,(W-1-X)/$3)*min(1,(H-1-Y)/$4)'"
}

# render largeur hauteur hauteur_façade centre_x fondu_gauche fondu_droit fondu_bas sortie
render() {
  local width=$1 height=$2 box=$3 cx=$4 fl=$5 fr=$6 fb=$7 out=$8
  # Le zoom se fait autour du centre de la façade, pour qu'elle reste entière.
  local px py
  px=$(ratio "$cx" "$width")
  py=$(ratio "$box" $((height * 2)))
  local inputs=() durations=() i=0

  for shot in "${SHOTS[@]}"; do
    IFS='|' read -r kind source a b <<< "$shot"
    if [[ $kind == photo ]]; then
      local duration=$a motion=$b frames zoom
      frames=$(frames_of "$duration")
      case $motion in
        in)  zoom="1+$ZOOM*on/$frames" ;;
        out) zoom="1+$ZOOM-$ZOOM*on/$frames" ;;
      esac
      # Suréchantillonnage x2 avant le zoompan : il arrondit sa fenêtre au
      # pixel, ce qui fait trembler l'image ; à 2x, l'arrondi disparaît à la
      # réduction.
      ffmpeg -nostdin -loglevel error -y -i "$source" -filter_complex "\
[0:v]split[a][b];\
[a]$(background $((width * 2)) $((height * 2)) 60)[bg];\
[b]$(facade $((box * 2)) $((fl * 2)) $((fr * 2)) $((fb * 2)))[fg];\
[bg][fg]overlay=x=$((cx * 2))-w/2:y=0:format=auto,\
zoompan=z='${zoom}':x='(iw-iw/zoom)*${px}':y='(ih-ih/zoom)*${py}':d=${frames}:s=${width}x${height}:fps=${FPS},\
format=yuv420p" -frames:v "$frames" -c:v libx264 -preset veryfast -crf 12 "$tmp/shot-$i.mp4"
    else
      local start=$a duration=$b frames
      frames=$(frames_of "$duration")
      ffmpeg -nostdin -loglevel error -y -ss "$start" -i "$source" -filter_complex "\
[0:v]fps=${FPS},split[a][b];\
[a]$(background "$width" "$height" 30)[bg];\
[b]$(facade "$box" "$fl" "$fr" "$fb")[fg];\
[bg][fg]overlay=x=${cx}-w/2:y=0:format=auto,setsar=1,format=yuv420p" \
        -frames:v "$frames" -an -c:v libx264 -preset veryfast -crf 12 "$tmp/shot-$i.mp4"
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

# Téléphones : façade haute de 800 px sur 1280, centrée, en haut du cadre.
render 720 1280 800 360 40 40 100 "${1:-public/hero}/hero-portrait.mp4"
# Écrans larges : façade haute de 660 px sur 720, centrée à x = 1020.
render 1280 720 660 1020 80 30 40 "${1:-public/hero}/hero-paysage.mp4"
