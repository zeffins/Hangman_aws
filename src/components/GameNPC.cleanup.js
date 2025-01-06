// Helper functions for GameNPC cleanup
export const cleanupMesh = (mesh) => {
  if (!mesh) return;
  
  if (mesh.geometry) {
    mesh.geometry.dispose();
  }
  
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(material => material.dispose());
    } else {
      mesh.material.dispose();
    }
  }
};

export const cleanupScene = (scene) => {
  if (!scene) return;
  
  while (scene.children.length > 0) {
    const object = scene.children[0];
    scene.remove(object);
    if (object.isMesh) {
      cleanupMesh(object);
    }
  }
};