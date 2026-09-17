#!/usr/bin/env bash
# Génère une vignette JPEG à côté de chaque .mp4 de public/.
#
# Les vidéos de l'agence sont filmées au téléphone : elles sont stockées en
# paysage avec une rotation de -90°, que ffmpeg applique au décodage — les
# vignettes sortent donc en portrait, à la bonne orientation.
#
# Sans vignette, un <video preload="none"> s'affiche en rectangle noir ; avec,
# le visiteur voit le chantier sans qu'un seul octet de vidéo soit téléchargé.
#
# Choix de l'image : prendre un instant fixe donne trop souvent un mur nu ou
# une image de transition. On échantillonne donc plusieurs moments du film et
# on garde le JPEG le plus lourd — à qualité d'encodage constante, le poids
# suit la quantité de détail, donc l'image la plus parlante.
#
# Usage : ./scripts/generate-posters.sh   (nécessite ffmpeg)
set -euo pipefail
cd "$(dirname "$0")/.."

WIDTH=480              # ~1,5x la largeur d'affichage des cartes, suffisant en rétine
QUALITY=6              # échelle ffmpeg -q:v : 2 = meilleur, 31 = pire
SAMPLES=(0.10 0.25 0.40 0.55 0.70 0.85)

# Instants imposés, quand l'échantillonnage automatique tombe mal. Le duplex
# de Cambérène est filmé alors que du linge sèche sur la terrasse : le choix
# automatique retenait cette image, la pire des couvertures pour une annonce
# de location. La seconde 1 montre le salon et sa porte-fenêtre.
declare -A FIXED_SECONDS=(
  ["public/biens/duplex-camberene-1/video.mp4"]=1
)

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

while IFS= read -r video; do
  poster="${video%.mp4}.jpg"
  duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video")

  if [ -n "${FIXED_SECONDS[$video]:-}" ]; then
    ffmpeg -nostdin -loglevel error -y -ss "${FIXED_SECONDS[$video]}" -i "$video" \
      -vf "scale=${WIDTH}:-2" -frames:v 1 -q:v "$QUALITY" "$poster"
    printf '%8s  %s (instant imposé)\n' "$(du -h "$poster" | cut -f1)" "$poster"
    continue
  fi

  best="" ; best_size=0
  for ratio in "${SAMPLES[@]}"; do
    seek=$(awk -v d="$duration" -v r="$ratio" 'BEGIN { printf "%.2f", d * r }')
    candidate="$tmp/$(basename "${video%.mp4}")-$ratio.jpg"
    # `thumbnail` écarte les images de transition parmi les 40 suivantes.
    ffmpeg -nostdin -loglevel error -y -ss "$seek" -i "$video" \
      -vf "thumbnail=40,scale=${WIDTH}:-2" -frames:v 1 -q:v "$QUALITY" "$candidate" 2>/dev/null || continue
    [ -s "$candidate" ] || continue
    size=$(stat -c%s "$candidate")
    if [ "$size" -gt "$best_size" ]; then best_size=$size ; best=$candidate ; fi
  done

  if [ -z "$best" ]; then echo "ÉCHEC  $video" >&2 ; continue ; fi
  cp "$best" "$poster"
  printf '%8s  %s\n' "$(du -h "$poster" | cut -f1)" "$poster"
done < <(find public -name '*.mp4' | sort)
