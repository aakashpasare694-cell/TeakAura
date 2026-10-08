import * as THREE from 'three';

export interface TouchJoystickState {
  moveX: number; // -1 to 1
  moveY: number; // -1 to 1
}

export class PlayerController {
  public camera: THREE.PerspectiveCamera;
  public domElement: HTMLElement;

  // Position & Rotation
  public position: THREE.Vector3 = new THREE.Vector3(0, 1.7, 5); // Eye height = 1.7m, Entrance Z = +5
  public rotation: { yaw: number; pitch: number } = { yaw: 0, pitch: 0 }; // Radians

  // Smooth Glide Target
  private targetPosition: THREE.Vector3 | null = null;
  private targetYaw: number | null = null;

  // Physics Velocity
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private speed = 10.0; // Fast responsive walking speed
  private damping = 0.75;

  // Key states
  private keys: { [key: string]: boolean } = {};
  public isMouseDown = false;
  private previousMousePosition = { x: 0, y: 0 };

  // Mobile Touch Control States
  public joystick: TouchJoystickState = { moveX: 0, moveY: 0 };
  private touchLookStart = { x: 0, y: 0 };
  private activeLookTouchId: number | null = null;

  // Collision Boundaries
  private minX = -11.5;
  private maxX = 11.5;
  private minZ = -132;
  private maxZ = 6.5;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.initEventListeners();
    this.updateCameraTransform();
  }

  private initEventListeners() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    this.domElement.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);

    // Touch events for mobile
    this.domElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.domElement.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.domElement.addEventListener('touchend', this.onTouchEnd);
  }

  public dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);

    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);

    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    this.domElement.removeEventListener('touchmove', this.onTouchMove);
    this.domElement.removeEventListener('touchend', this.onTouchEnd);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
    this.targetPosition = null; // Cancel auto-glide if user presses a key
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  private onMouseDown = (e: MouseEvent) => {
    if (e.target !== this.domElement && !this.domElement.contains(e.target as Node)) return;
    this.isMouseDown = true;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };
    this.targetPosition = null;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isMouseDown) return;

    const deltaX = e.clientX - this.previousMousePosition.x;
    const deltaY = e.clientY - this.previousMousePosition.y;

    const sensitivity = 0.004;
    this.rotation.yaw -= deltaX * sensitivity;
    this.rotation.pitch -= deltaY * sensitivity;
    this.rotation.pitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.rotation.pitch));

    this.previousMousePosition = { x: e.clientX, y: e.clientY };
    this.updateCameraTransform();
  };

  private onMouseUp = () => {
    this.isMouseDown = false;
  };

  private onTouchStart = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.clientX > window.innerWidth / 2 && this.activeLookTouchId === null) {
        this.activeLookTouchId = touch.identifier;
        this.touchLookStart = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === this.activeLookTouchId) {
        const deltaX = touch.clientX - this.touchLookStart.x;
        const deltaY = touch.clientY - this.touchLookStart.y;

        const sensitivity = 0.005;
        this.rotation.yaw -= deltaX * sensitivity;
        this.rotation.pitch -= deltaY * sensitivity;
        this.rotation.pitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.rotation.pitch));

        this.touchLookStart = { x: touch.clientX, y: touch.clientY };
        this.updateCameraTransform();
      }
    }
  };

  private onTouchEnd = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === this.activeLookTouchId) {
        this.activeLookTouchId = null;
      }
    }
  };

  // -------------------------------------------------------------
  // DIRECT INSTANT MOVEMENT METHODS FOR ON-SCREEN D-PAD BUTTONS
  // -------------------------------------------------------------

  public stepForward(amount = 1.8) {
    this.targetPosition = null;
    const forward = new THREE.Vector3(-Math.sin(this.rotation.yaw), 0, -Math.cos(this.rotation.yaw));
    this.position.addScaledVector(forward, amount);
    this.clampPosition();
    this.updateCameraTransform();
  }

  public stepBackward(amount = 1.8) {
    this.targetPosition = null;
    const forward = new THREE.Vector3(-Math.sin(this.rotation.yaw), 0, -Math.cos(this.rotation.yaw));
    this.position.addScaledVector(forward, -amount);
    this.clampPosition();
    this.updateCameraTransform();
  }

  public turnLeft(angle = 0.25) {
    this.rotation.yaw += angle;
    this.updateCameraTransform();
  }

  public turnRight(angle = 0.25) {
    this.rotation.yaw -= angle;
    this.updateCameraTransform();
  }

  public strafeLeft(amount = 1.5) {
    this.targetPosition = null;
    const right = new THREE.Vector3(Math.cos(this.rotation.yaw), 0, -Math.sin(this.rotation.yaw));
    this.position.addScaledVector(right, -amount);
    this.clampPosition();
    this.updateCameraTransform();
  }

  public strafeRight(amount = 1.5) {
    this.targetPosition = null;
    const right = new THREE.Vector3(Math.cos(this.rotation.yaw), 0, -Math.sin(this.rotation.yaw));
    this.position.addScaledVector(right, amount);
    this.clampPosition();
    this.updateCameraTransform();
  }

  public glideTo(targetX: number, targetZ: number, targetYaw?: number) {
    this.targetPosition = new THREE.Vector3(targetX, 1.7, targetZ);
    if (targetYaw !== undefined) {
      this.targetYaw = targetYaw;
    } else {
      const dx = targetX - this.position.x;
      const dz = targetZ - this.position.z;
      if (Math.hypot(dx, dz) > 0.5) {
        this.targetYaw = Math.atan2(-dx, -dz);
      }
    }
  }

  public teleportTo(targetZ: number, targetX: number = 0) {
    this.targetPosition = null;
    this.position.set(targetX, 1.7, targetZ);
    this.rotation.pitch = 0;
    this.velocity.set(0, 0, 0);
    this.clampPosition();
    this.updateCameraTransform();
  }

  private clampPosition() {
    this.position.x = Math.max(this.minX, Math.min(this.maxX, this.position.x));
    this.position.z = Math.max(this.minZ, Math.min(this.maxZ, this.position.z));
    this.position.y = 1.7;
  }

  /**
   * Called every animation frame in requestAnimationFrame
   */
  public update(deltaTime: number) {
    // 1. Smooth Glide to Target
    if (this.targetPosition) {
      this.position.lerp(this.targetPosition, 0.15);
      if (this.targetYaw !== null) {
        let diff = this.targetYaw - this.rotation.yaw;
        // Normalize angle difference to [-PI, PI]
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.rotation.yaw += diff * 0.12;
      }
      this.rotation.pitch *= 0.85;

      if (this.position.distanceTo(this.targetPosition) < 0.15) {
        this.position.copy(this.targetPosition);
        this.targetPosition = null;
        this.targetYaw = null;
      }
      this.clampPosition();
      this.updateCameraTransform();
      return;
    }

    // 2. Keyboard & Touch Physics Update
    const moveVector = new THREE.Vector3(0, 0, 0);

    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveVector.z -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveVector.z += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveVector.x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveVector.x += 1;

    if (this.joystick.moveY !== 0) moveVector.z += this.joystick.moveY;
    if (this.joystick.moveX !== 0) moveVector.x += this.joystick.moveX;

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();

      const forward = new THREE.Vector3(-Math.sin(this.rotation.yaw), 0, -Math.cos(this.rotation.yaw));
      const right = new THREE.Vector3(Math.cos(this.rotation.yaw), 0, -Math.sin(this.rotation.yaw));

      const desiredDir = new THREE.Vector3()
        .addScaledVector(forward, -moveVector.z)
        .addScaledVector(right, moveVector.x);

      this.velocity.addScaledVector(desiredDir, this.speed * deltaTime * 20);
    }

    this.velocity.multiplyScalar(Math.pow(this.damping, deltaTime * 60));
    this.position.add(this.velocity);

    this.clampPosition();
    this.updateCameraTransform();
  }

  public updateCameraTransform() {
    this.camera.position.copy(this.position);

    const lookTarget = new THREE.Vector3(
      this.position.x - Math.sin(this.rotation.yaw) * Math.cos(this.rotation.pitch),
      this.position.y + Math.sin(this.rotation.pitch),
      this.position.z - Math.cos(this.rotation.yaw) * Math.cos(this.rotation.pitch)
    );

    this.camera.lookAt(lookTarget);
  }
}
