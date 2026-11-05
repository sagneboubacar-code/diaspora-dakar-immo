#!/usr/bin/env bash
# Monte le film de chaque chantier de la page Réalisations : un seul lecteur
# par chantier, plutôt que six vidéos côte à côte. Les plans sont des extraits
# des vidéos de l'agence : celles du dossier public du chantier, ou celles du
# dossier local « realisation N/ » (médias bruts reçus sur WhatsApp, non
# versionnés, comme les autres médias bruts de l'agence).
#
# Les vidéos sources n'ont ni la même taille ni la même cadence (360x640,
# 478x850 à 120 images/s, 1024x576 tournées de -90°, que ffmpeg redresse au
# décodage). Chaque plan est ramené à 576x1024 en hauteur, 30 images/s, avec
# un fondu court à l'entrée et à la sortie. Sans le son : les vidéos de
# l'agence n'en ont pas toutes, et il n'apporte rien au chantier.
#
# Plans : « fichier|début (s)|durée (s) », dans l'ordre du film.
#
# Usage : ./scripts/build-realisation-films.sh [1|3]   (nécessite ffmpeg)
#   sans argument, tous les films ; avec un numéro, le film de ce chantier.
# Puis les affiches : ./scripts/generate-posters.sh
set -euo pipefail
cd "$(dirname "$0")/.."

CRF=28   # 576x1024 à environ 0,8 Mbit/s : 12 Mo pour 2 min, chargé à la demande
ONLY=${1:-}
wanted() { [ -z "$ONLY" ] || [ "$ONLY" = "$1" ]; }

montage() {
  local out=$1; shift
  local inputs=() filters="" labels="" i=0 file start duration fade_out
  for plan in "$@"; do
    IFS='|' read -r file start duration <<<"$plan"
    inputs+=(-ss "$start" -t "$duration" -i "$file")
    fade_out=$(awk -v d="$duration" 'BEGIN { printf "%.2f", d - 0.35 }')
    filters+="[$i:v]setpts=PTS-STARTPTS,scale=576:1024:force_original_aspect_ratio=decrease,"
    filters+="pad=576:1024:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p,"
    filters+="fade=t=in:st=0:d=0.3,fade=t=out:st=$fade_out:d=0.35[v$i];"
    labels+="[v$i]"
    i=$((i + 1))
  done
  ffmpeg -nostdin -loglevel error -y "${inputs[@]}" \
    -filter_complex "${filters}${labels}concat=n=$i:v=1:a=0[out]" -map "[out]" \
    -c:v libx264 -preset slow -crf "$CRF" -profile:v high -movflags +faststart -an "$out"
  printf '%8s  %s\n' "$(du -h "$out" | cut -f1)" "$out"
}

# Chantier 1 — des fondations à la maison livrée, puis la visite de
# l'intérieur. Vidéos envoyées par le client (discussion WhatsApp « Issa
# France », téléchargées le 2026-11-05) : les trois du gros œuvre, la façade
# au crépuscule et de jour, puis des extraits des visites filmées pièce par
# pièce (9 min, 7 min et 2 min 30), choisis là où l'image est stable.
R1="realisation 1/WhatsApp Video"
if wanted 1; then montage public/realisations/chantier-1/montage.mp4 \
  "$R1 2026-10-26 at 23.49.53.mp4|0|14" \
  "$R1 2026-10-26 at 23.36.21.mp4|0|14" \
  "$R1 2026-10-26 at 23.36.18.mp4|0|14" \
  "$R1 2026-10-24 at 00.39.17.mp4|0|14" \
  "$R1 2026-10-26 at 23.34.49.mp4|34|12" \
  "$R1 2026-10-26 at 23.24.01.mp4|0|16" \
  "$R1 2026-10-16 at 23.24.32.mp4|82|12" \
  "$R1 2026-10-26 at 23.19.19.mp4|62|14" \
  "$R1 2026-10-16 at 23.24.32.mp4|152|12" \
  "$R1 2026-10-26 at 23.28.25.mp4|14|12" \
  "$R1 2026-10-16 at 23.24.32.mp4|336|16" \
  "$R1 2026-10-16 at 23.24.32.mp4|516|14"
fi

# Chantier 3 — les finitions, une pièce après l'autre, tirées de 7 min 20 de
# vidéos : l'entrée et l'escalier sous l'arche, le salon et son lustre, la
# cuisine, les chambres et leurs bandeaux de couleur, la salle d'eau.
C3=public/realisations/chantier-3
if wanted 3; then montage "$C3/montage.mp4" \
  "$C3/03-finition.mp4|0|18" \
  "$C3/05-finition.mp4|44|24" \
  "$C3/04-finition.mp4|0|14" \
  "$C3/08-finition.mp4|40|32" \
  "$C3/06-finition.mp4|0|16"
fi
