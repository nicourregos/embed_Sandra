"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Bounds, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Mesh } from "three";

interface Props {
    coordinates: number[];
    rotation: number[];
}

function MeshComponent({ coordinates, rotation }: Props) {
    const fileUrl = "assets/globo_geopolitico_gris.gltf";
    const mesh = useRef<Mesh>(null!);
    const gltf = useLoader(GLTFLoader, fileUrl);
    gltf.scene.scale.set(4, 4, 4);

    /* if (mesh.current) {
        mesh.current.position.x = coordinates[0];
        mesh.current.position.y = coordinates[1];
        mesh.current.position.z = coordinates[2];
        mesh.current.rotation.x = rotation[0];
        mesh.current.rotation.y = rotation[1];
        mesh.current.rotation.z = rotation[2];
    } */

    useFrame(() => {
        if (mesh.current) {
            let delta_x = mesh.current.position.x < coordinates[0] + 0.01 && mesh.current.position.x > coordinates[0] - 0.01 ? 0 : mesh.current.position.x < coordinates[0] ? 0.01 : -0.01;
            let delta_y = mesh.current.position.y < coordinates[1] + 0.01 && mesh.current.position.y > coordinates[1] - 0.01 ? 0 : mesh.current.position.y < coordinates[1] ? 0.01 : -0.01;
            let delta_z = mesh.current.position.z < coordinates[2] + 0.009 && mesh.current.position.z > coordinates[2] - 0.009 ? 0 : mesh.current.position.z < coordinates[2] ? 0.009 : -0.009;
            let delta_r_x = mesh.current.rotation.x < rotation[0] + 0.01 && mesh.current.rotation.x > rotation[0] - 0.01 ? 0 : mesh.current.rotation.x < rotation[0] ? 0.01 : -0.01;
            let delta_r_y = mesh.current.rotation.y < rotation[1] + 0.01 && mesh.current.rotation.y > rotation[1] - 0.01 ? 0 : mesh.current.rotation.y < rotation[1] ? 0.01 : -0.01;
            let delta_r_z = mesh.current.rotation.z < rotation[2] + 0.01 && mesh.current.rotation.z > rotation[2] - 0.01 ? 0 : mesh.current.rotation.z < rotation[2] ? 0.01 : -0.01;
            mesh.current.position.x += delta_x;
            mesh.current.position.y += delta_y;
            mesh.current.position.z += delta_z;
            mesh.current.rotation.x += delta_r_x;
            mesh.current.rotation.y += delta_r_y;
            mesh.current.rotation.z += delta_r_z;
        }
    });

    /* useEffect(() => {
        if (mesh.current) {
            mesh.current.position.x = coordinates[0];
            mesh.current.position.y = coordinates[1];
            mesh.current.position.z = coordinates[2];
        }
    }, []); */

    return (
        <mesh ref={mesh}>
            <primitive object={gltf.scene} />
        </mesh>
    );
}

export default function World({ coordinates, rotation }: Props) {
    return (
        <div className='flex justify-center items-center h-screen'>
            <Canvas className='w-screen h-screen'>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <MeshComponent coordinates={coordinates} rotation={rotation} />
                <OrbitControls />
            </Canvas>
        </div>
    );
}
