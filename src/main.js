/**
 * Default: polished, self-contained illustrated 2.5D renderer; no CDN required.
 * ?renderer=three keeps the original Three.js procedural version available for comparison.
 * Both renderers use the *same* gameplay, level definitions, education and save data.
 */
let Renderer;
if(new URLSearchParams(location.search).get('renderer')==='three'){
  const mod=await import('./scene3d.js'); Renderer=mod.World3D;
}else{
  const mod=await import('./premium.js'); Renderer=mod.PainterWorld;
}
window.LeapScene3D=Renderer;
await import('./game.js');
