import {useRef, useEffect} from 'react'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


const Scene = () => {
    const mountRef = useRef(null);

    useEffect(()=>{

        // se instancia la escena, la camara y el lugar donde se va a renderizar, ademas a la escena se agrega la camara
        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camara = new THREE.PerspectiveCamera(
            25,
            currentMount.clientWidth / currentMount.clientHeight,
            0.1,
            1000
        );

        camara.position.z = 6
        

        scene.add(camara);

        //renderer, define el tamaño del render en este caso al tamaño del navegador y se pasa al elemento html

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(
            currentMount.clientWidth,
            currentMount.clientHeight
            )
         currentMount.appendChild(renderer.domElement);   

         //controls definimos los controles y establecemos el punto de anclaje para el movimiento y definimos una propiedad para evitar el retraso al soltar el mouse

         const control = new OrbitControls(camara, renderer.domElement);
         control.target = new THREE.Vector3(0,0,0);
         control.enableDamping =true;


         //Cube 

         const cubo = new THREE.Mesh(
            new THREE.BoxBufferGeometry(
                1,1,1
            ),
            new THREE.MeshBasicMaterial(
                {
                    color: 0xff0000,
                    transparent: true,
                    opacity: 0.3,
                    wireframe: true,
                }
            )
         );

         scene.add(cubo);
        
         // sphere 

         // los matcaps se obtienen de : https://github.com/nidorx/matcaps
        const textlo = new THREE.TextureLoader();
        const matcap2 = textlo.load('https://raw.githubusercontent.com/nidorx/matcaps/master/1024/9C5B3B_49200A_E9C8AB_DDAB7D.png')

        const geoSphere  =  new THREE.SphereGeometry(0.8, 32, 16);
        const material = new THREE.MeshMatcapMaterial(
            {
                matcap:matcap2
            }
        );
        const sphere = new THREE.Mesh( geoSphere, material);
            sphere.position.y=2;

         scene.add(sphere);

         // tourusKnot

        const geometry = new THREE.TorusKnotGeometry( 0.5, 0.18, 100, 16 ); 
        const material1 = new THREE.MeshNormalMaterial( {
            flatShading: true
        }); 
        const torusKnot = new THREE.Mesh( geometry, material1 ); scene.add( torusKnot );
         
                torusKnot.position.y=-2;

         // tourusKnot2
        const textureL = new THREE.TextureLoader();
        const matcap = textureL.load('https://raw.githubusercontent.com/nidorx/matcaps/master/1024/464445_D2D0CB_919196_A8ADB0.png');
         const geometry2 = new THREE.TorusKnotGeometry( 0.5, 0.18, 100, 16 ); 
         const material2 = new THREE.MeshMatcapMaterial( {
             matcap:matcap,
         }); 
         const torusKnot2 = new THREE.Mesh( geometry2, material2 ); 
        scene.add( torusKnot2 );
        torusKnot2.position.x= -2;


        //Cube with ligths an standard material : 

        //ligths
        const AO=  new THREE.AmbientLight( 0xffffff, 0.5);  //color e intensidad de la luz
        const PL = new THREE.PointLight(
            0xff0000,
             2
        );
        PL.position.y=2;
        PL.position.x=2;
        const DL = new THREE.DirectionalLight(
            0xffffff,
            1.5,

        );
        DL.position.set(3,2,1);
        
        scene.add(DL);
        scene.add(PL);
        scene.add(AO);
            // -- luces hdri --//
            const hdri = new THREE.CubeTextureLoader();
            const envMap = hdri.load([
                './hdri/px.png',
                './hdri/nx.png',
                './hdri/py.png',
                './hdri/ny.png',
                './hdri/pz.png',
                './hdri/nz.png',
            ]);

            scene.environment = envMap;
            scene.background = envMap;

         //Textures add 

        const textuoader = new THREE.TextureLoader();         
        const map = textuoader.load('./ground_0027_2k_5QfJDv/ground_0027_color_2k.jpg');
        const aoMap = textuoader.load('./ground_0027_2k_5QfJDv/ground_0027_ao_2k.jpg');
        const roughnessMap = textuoader.load('/ground_0027_2k_5QfJDv/ground_0027_roughness_2k.jpg');
        const normales = textuoader.load('/ground_0027_2k_5QfJDv/ground_0027_normal_opengl_2k.png');
        const heightMap = textuoader.load('/ground_0027_2k_5QfJDv/ground_0027_height_2k.png');
         
         //cube

        const cubo2 = new THREE.Mesh(
            new THREE.BoxBufferGeometry(
                1,1,1,
                2,
                2,
                2
            ),
            new THREE.MeshStandardMaterial(
                {
                    map:map,
                    aoMap: aoMap,
                    roughnessMap: roughnessMap,
                    normalMap: normales,
                    displacementMap: heightMap,
                    displacementScale:0.05
                }
         ));

         cubo2.position.set(2,0,0);

         scene.add(cubo2);

         //render the scena
               // animación de frames para el control
               
           const animate = ()=>{
            control.update();
            renderer.render(scene,camara);  // render de la escena
            requestAnimationFrame(animate); // se hace un llamado recursivo a la misma funcion
           }    

           animate();

         //clean scena
                return ()=>{
                    currentMount.removeChild(renderer.domElement)
                }

    },[])

  return (
    <div
        className="Contenedor3D"
        ref = {mountRef}
        style ={{width:'100%', height: '100vh'}}
    >
    
    </div>
  )
}

export default Scene