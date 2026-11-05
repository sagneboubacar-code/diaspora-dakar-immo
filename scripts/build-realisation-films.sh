#!/usr/bin/env bash
# Monte le film de chaque chantier de la page Réalisations : un seul lecteur
# par chantier, plutôt que six vidéos côte à côte. Les plans sont des extraits
# des vidéos de l'agence, qui restent dans le dossier du chantier.
#
# Les vidéos sources n'ont ni la même taille ni la même cadence (360x640,
# 478x850 à 120 images/s, 1024x576 tournées de -90°, que ffmpeg redresse au
# décodage). Chaque plan est ramené à 576x1024 en hauteur, 30 images/s, avec
# un fondu court à l'entrée et à la sortie. Sans le son : les vidéos de
# l'agence n'en ont pas toutes, et il n'apporte rien au chantier.
#
# Plans : « fichier|début (s)|durée (s) », dans l'ordre du film.
#
# Usage : ./scripts/build-realisation-films.sh   (nécessite ffmpeg)
# Puis les affiches : ./scripts/generate-posters.sh
set -euo pipefail
cd "$(dirname "$0")/.."

CRF=28   # 576x1024 à environ 0,8 Mbit/s : 12 Mo pour 2 min, chargé à la demande

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

# Chantier 1 — tout le chantier, des fondations à la maison livrée.
C1=public/realisations/chantier-1
montage "$C1/montage.mp4" \
  "$C1/fondations.mp4|0|22.3" \
  "$C1/debut-chantier.mp4|0|27.9" \
  "$C1/debut-avance.mp4|0|31.3" \
  "$C1/livraison-facade.mp4|0|13.5" \
  "$C1/livraison-sejour.mp4|0|18" \
  "$C1/livraison-salle-d-eau.mp4|0|15.5"

# Chantier 3 — les finitions, une pièce après l'autre, tirées de 7 min 20 de
# vidéos : l'entrée et l'escalier sous l'arche, le salon et son lustre, la
# cuisine, les chambres et leurs bandeaux de couleur, la salle d'eau.
C3=public/realisations/chantier-3
montage "$C3/montage.mp4" \
  "$C3/03-finition.mp4|0|18" \
  "$C3/05-finition.mp4|44|24" \
  "$C3/04-finition.mp4|0|14" \
  "$C3/08-finition.mp4|40|32" \
  "$C3/06-finition.mp4|0|16"
