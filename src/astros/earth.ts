import {
  Mesh,
  AdditiveBlending,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from "three";
import { Planet } from "../planet";

export class Earth extends Planet {
  constructor(props: { orbitSpeed: any; orbitRadius: any; orbitRotationDirection: any; planetSize: any; planetAngle: any; planetRotationSpeed: any; planetRotationDirection: any; planetTexture: any; rimHex?: any; facingHex?: any; rings?: any; }) {
    super(props);

    this.createPlanetLights();
    this.createPlanetClouds();
  }

  createPlanetLights() {
    const planetLightsMaterial = new MeshBasicMaterial({
      map: this.loader.load("/assets/earth-map-2.jpg"),
      blending: AdditiveBlending,
    });
    const planetLightsMesh = new Mesh(
      this.planetGeometry,
      planetLightsMaterial
    );
    this.planetGroup.add(planetLightsMesh);

    this.group.add(this.planetGroup);
  }

  createPlanetClouds() {
    const planetCloudsMaterial = new MeshStandardMaterial({
      map: this.loader.load("/assets/earth-map-3.jpg"),
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending,
      alphaMap: this.loader.load(
        "/assets/earth-map-4.jpg"
      ),
    });
    const planetCloudsMesh = new Mesh(
      this.planetGeometry,
      planetCloudsMaterial
    );
    planetCloudsMesh.scale.setScalar(1.003);
    this.planetGroup.add(planetCloudsMesh);

    this.group.add(this.planetGroup);
  }
}
