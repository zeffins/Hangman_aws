import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/GameNPC.css';
import '../styles/GameNPC.cleanup.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const GameNPC = ({ mood = 'neutral', onRequestHint }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animationFrameRef = useRef(null);
  const npcRef = useRef(null);

  const reactions = {
    correct: [
      "You're getting better at this!",
      "That's the way to do it!"
    ],
    wrong: [
      "Oops! Better luck next time!",
      "Not quite! But don't give up!",
      "Ha! You might want to think harder!",
      "That was... interesting!"
    ]
  };

  useEffect(() => {
    const width = 200;
    const height = 200;

    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    rendererRef.current = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    rendererRef.current.setClearColor(0x000000, 0);

    rendererRef.current.setSize(width, height);
    mountRef.current.appendChild(rendererRef.current.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    sceneRef.current.add(directionalLight);

    // Position camera
    cameraRef.current.position.z = 3;
    cameraRef.current.position.y = 0;
    cameraRef.current.lookAt(0, 0, 0);
    
    // Add a subtle ambient animation to camera
    const cameraAnimate = () => {
      cameraRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    };
    sceneRef.current.onBeforeRender = cameraAnimate;

    // Load the 3D model
    const loader = new GLTFLoader();
    loader.load(
      '/models/character.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        
        // Add color changing material based on mood
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.color = new THREE.Color(
              mood === 'happy' ? 0x00ff00 : mood === 'sad' ? 0xff0000 : 0x7a7aff
            );
            // Make material more visible
            child.material.emissive = new THREE.Color(0x333333);
            child.material.emissiveIntensity = 0.5;
          }
        });
        
        sceneRef.current.add(model);
        npcRef.current = model;
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading 3D model:', error);
        setLoadError(true);
        setIsLoading(false);
      }
    );

    // Animation
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (npcRef.current) {
        // Smoother, alien-like floating animation
        npcRef.current.position.y = -2 + Math.sin(Date.now() * 0.001) * 0.1;
        npcRef.current.rotation.y += 0.005;
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    };
  }, [mood]);

  return (
    <div
      className="game-npc"
      role="button"
      aria-label="Click for a hint"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRequestHint();
        }
      }}
      onClick={() => {
        if (onRequestHint) {
          onRequestHint();
          // Add a small pulse animation when clicked
          const npc = mountRef.current.querySelector('.npc-fallback');
          if (npc) {
            npc.style.transform = 'scale(1.2)';
            setTimeout(() => {
              npc.style.transform = 'scale(1)';
            }, 200);
          }
        }
      }}
    >
      <div ref={mountRef} style={{ 
        width: '200px', 
        height: '200px',
        background: 'radial-gradient(circle at center, rgba(122, 122, 255, 0.1) 0%, transparent 70%)'
      }}>
        <div className="npc-fallback" style={{
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(122, 122, 255, 0.2) 0%, rgba(122, 122, 255, 0.1) 100%)',
          borderRadius: '50%',
          animation: 'pulse 2s infinite ease-in-out'
        }} />
      </div>
      {/* Always show message bubble */}
      {true && (
        <div className="npc-message">
          {mood === 'neutral'
            ? "Click me for game hints!"
            : mood === 'happy'
              ? reactions.correct[Math.floor(Math.random() * reactions.correct.length)]
              : reactions.wrong[Math.floor(Math.random() * reactions.wrong.length)]
          }
        </div>
      )}
    </div>
  );
};

GameNPC.propTypes = {
  mood: PropTypes.oneOf(['neutral', 'happy', 'sad']),
  onRequestHint: PropTypes.func.isRequired
};

GameNPC.defaultProps = {
  mood: 'neutral'
};

export default GameNPC;