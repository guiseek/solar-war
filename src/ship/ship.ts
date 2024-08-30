import { AnimationAction, AnimationMixer, Group, Vector3 } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { Missile } from "./missile";
import { audio } from "../audio";

export class Ship {
  #angle = 0.01;

  #velocity = {
    curr: 0.008,
    min: 0.002,
    acc: 0.002,
    max: 0.01,
  };

  #group = new Group();

  #mixer: AnimationMixer;

  #action: AnimationAction;

  #missile?: GLTF;
  #lastMissile = 0;
  #missiles = new Set<Missile>();

  constructor(gltf: GLTF, private control: Control) {
    this.#group.add(gltf.scene);
    this.#mixer = new AnimationMixer(this.#group);
    this.#group.scale.setScalar(0.001);

    this.#group.rotation.y = -Math.PI / 2;
    const [clip] = gltf.animations;
    this.#action = new AnimationAction(this.#mixer, clip);
    this.#action.setEffectiveWeight(1);
    this.#action.play();
  }

  #toForward(velocity: number) {
    const direction = new Vector3(0, 0, -1).applyQuaternion(
      this.#group.quaternion
    );
    this.#group.position.addScaledVector(direction, -velocity);
  }

  get direction() {
    return this.#group.getWorldDirection(new Vector3(0, 0, 1));
  }

  #fire() {
    if (this.#missile) {
      const missile = new Missile(
        this.#missile,
        this.direction,
        this.#velocity.max * 1.2
      );

      missile.position.copy(this.#group.position);
      missile.quaternion.copy(this.#group.quaternion);

      this.#missiles.add(missile);
      this.#group.parent?.add(missile.getMissile());
    }
  }

  setMissile(missile: GLTF) {
    this.#missile = missile;
  }

  update(delta: number) {
    this.#mixer.update(delta);
    if (this.control.ShiftLeft && this.#velocity.curr < this.#velocity.max) {
      this.#velocity.curr += this.#velocity.acc;
      if (audio.passBy.paused) audio.passBy.play();
    }

    if (!this.control.ShiftLeft && this.#velocity.curr > this.#velocity.min) {
      this.#velocity.curr -= this.#velocity.acc;
    }

    this.#toForward(this.#velocity.curr);

    if (this.control.ArrowUp || this.control.KeyW) {
      this.#group.rotateX(this.#angle);
    }

    if (this.control.ArrowRight || this.control.KeyD) {
      this.#group.rotateZ(this.#angle);
    }

    if (this.control.ArrowDown || this.control.KeyS) {
      this.#group.rotateX(-this.#angle);
    }

    if (this.control.ArrowLeft || this.control.KeyA) {
      this.#group.rotateZ(-this.#angle);
    }

    for (const missile of this.#missiles) {
      missile.update();

      const distance = missile.position.distanceTo(this.#group.position);

      if (distance > 100) this.#neutralize(missile);
    }

    if (this.control.Space && Date.now() - this.#lastMissile > 600) {
      this.#fire();
      this.#lastMissile = Date.now();
    }

    // console.log(this.#group.position);
  }

  #neutralize(missile: Missile) {
    this.#missiles.delete(missile);
    this.#group.parent?.remove(missile.getMissile());
  }

  setPosition(x: number, y: number, z: number) {
    this.#group.position.set(x, y, z);
  }

  get position() {
    return this.#group.position;
  }

  getShip() {
    return this.#group;
  }
}
