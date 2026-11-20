/**
 * Default: polished, self-contained illustrated 2.5D renderer; no CDN required.
 * ?renderer=three keeps the original Three.js procedural version available for comparison.
 * Both renderers use the *same* gameplay, level definitions, education and save data.
 */
if(!window.LeapDiversity)await import('./diversity_v13.js');
if(!window.LeapWorldOne)await import('./world1_v14.js');
if(!window.LeapWorldExpedition)await import('./worlds_v15.js');
if(!window.LearnCurriculum)await import('./curriculum.js');
if(!window.LeapLevels)await import('./levels.js');
let Renderer;
if(new URLSearchParams(location.search).get('renderer')==='three'){
  const mod=await import('./scene3d.js'); Renderer=mod.World3D;
}else{
  const mod=await import('./premium.js'); Renderer=mod.PainterWorld;
}
window.LeapScene3D=Renderer;
await import('./game.js');
