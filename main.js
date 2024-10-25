const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './alphabet.mind',
			maxTrack: 3,
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
		const fox = await loadGLTF("./fox/scene.gltf");
		fox.scene.scale.set(0.01, 0.01, 0.01);
		fox.scene.position.set(0, -2, -2);
		
		const foxMixer = new THREE.AnimationMixer(fox.scene);
		const foxAction = foxMixer.clipAction(fox.animations[0]);
		foxAction.play();
		
		const foxAclip = await loadAudio("./sound/fox.mp3");
		const foxListener = new THREE.AudioListener();
		const foxAudio = new THREE.PositionalAudio(foxListener);
		
		const shark = await loadGLTF("./shark/scene.gltf");
		shark.scene.scale.set(0.2, 0.2, 0.2);
		shark.scene.rotation.set(0.0, 900, 0);
		
		
		const tree = await loadGLTF("./tree/scene.gltf");
		tree.scene.scale.set(0.1, 0.1, 0.1);
		tree.scene.position.set(0.2, -0.4, -0.2);
		
		const foxAnchor = mindarThree.addAnchor(0);
		foxAnchor.group.add(fox.scene);
		camera.add(foxListener);
		foxAudio.setRefDistance(100);
		foxAudio.setBuffer(foxAclip);
		foxAudio.setLoop(true);
		foxAnchor.group.add(foxAudio);
		
		foxAnchor.onTargetFound = () => {
			foxAudio.play();
		}
		
		foxAnchor.onTargetLost = () => {
			foxAudio.pause();
		}
		
		
		const sharkAnchor = mindarThree.addAnchor(1);
		sharkAnchor.group.add(shark.scene);
		
		const treeAnchor = mindarThree.addAnchor(2);
		treeAnchor.group.add(tree.scene);
		
		const clock = new THREE.Clock();
		
		
		await mindarThree.start();		
		
		renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			foxMixer.update(delta);
			fox.scene.rotation.set(0, fox.scene.rotation.y + delta, 0);
			renderer.render(scene, camera);
		});
	}
	start();
	
});