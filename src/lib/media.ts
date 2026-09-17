// Chaque .mp4 de public/ a une vignette JPEG générée à côté de lui, au même
// nom, par scripts/generate-posters.sh. Sans elle, un <video> s'affiche en
// rectangle noir tant que le visiteur n'a pas cliqué.
//
// Les vidéos de l'agence sont filmées au téléphone : elles sont en portrait
// (9/16), et les vignettes aussi — d'où les cadres verticaux à l'affichage.
export function posterFor(video: string) {
  return video.replace(/\.mp4$/, ".jpg");
}
