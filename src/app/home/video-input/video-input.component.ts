import { Component, AfterViewInit, ElementRef, ViewChild, Input, ViewChildren } from "@angular/core";
import { Exercise } from "../exercises/exercise";
import { ExerciseServiceService } from "../exercise-service.service";

import * as posenet from '@tensorflow-models/posenet';
import * as dat from 'dat.gui';
import Stats from 'stats.js';

import { DemoUtilService } from './demo-util.service';
import { ModalService } from 'carbon-components-angular';
import { Router } from '@angular/router';

@Component({
	selector: "app-video-input",
	templateUrl: "./video-input.component.html",
	styleUrls: ["./video-input.component.scss"],

})
export class VideoInputComponent implements AfterViewInit {

	@ViewChild("video") video: ElementRef;
	@ViewChild("canvas") canvas: ElementRef;

	sets: number;
	reps: number;
	id: number;
	exercise: Exercise;
	isDone: boolean = false;
	endExercise: boolean = false;
	openModal: boolean = false;
	openModal2: boolean = false;

	private context: CanvasRenderingContext2D;

	radio = ["The exercise was too difficult to complete", "The exercise was too painful to complete", "I have completed the exercise and cannot proceed"];
	options = ["I experienced some pain completing the exercise", "I experienced some difficulty completing the exercise but no pain", "I completed the exercise"];

	constraints = {
		video: { width: 1280, height: 800 }
	};

	constructor(private exerciseService: ExerciseServiceService, private demo: DemoUtilService, protected modalService: ModalService, private route: Router) {
		this.sets = 0;
		this.reps = 0;

		// this.id = +this.route.snapshot.paramMap.get('id');
		this.exercise = this.exerciseService.getExercise(1);
		console.log(this.exercise);
	}

	completeRep() {
		if (this.reps !== this.exercise.reps) {
			this.reps++;
		} else {
			this.reps = 0;
			this.completeSet();
		}
	}

	completeSet() {
		this.sets++
		if (this.sets == this.exercise.sets) {
			this.isDone = true;
			this.endExercise = true;
			console.log("DONE");
		}
	}

	closeModal() {
		this.openModal = false;
	}

	closeModal2() {
		this.openModal2 = false;
	}

	showModal() {
		this.openModal = true;
	}

	showModal2() {
		this.openModal2 = true;
	}

	submit1(){
		this.route.navigate(['/dashboard']);	
	}

	// Wait for componenet to load
	public ngAfterViewInit() {
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
			this.video.nativeElement.srcObject = stream;
		}).catch((err) => {
			console.log(err);
		});
	}
}
	// this.context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
	// this.drawOnCanvas();

	// this.bindPage();


drawOnCanvas() {
	this.context.font = "30px Arial";
	this.context.textBaseline = 'middle';
	this.context.textAlign = 'center';
	
	const x = (this.canvas.nativeElement as HTMLCanvasElement).width / 2;
	const y = (this.canvas.nativeElement as HTMLCanvasElement).height / 2;
	this.context.fillText("@realappie", x, y);
}

NgOnInit() {
	// this.context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
	// this.drawOnCanvas();
}

/**
 * Camera
 */

	stats: Stats;

	/**
	* Loads a the camera to be used in the demo
	 *
	 */
	async setupCamera() {
		console.log("Testing");
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			throw new Error(
				'Browser API navigator.mediaDevices.getUserMedia not available');
		}

		this.video.nativeElement.width = this.constraints.video.width;
		this.video.nativeElement.height = this.constraints.video.height;

		// const mobile = isMobile();
		const stream = await navigator.mediaDevices.getUserMedia({
			'audio': false,
			'video': {
				facingMode: 'user',
				// width: mobile ? undefined : videoWidth,
				// height: mobile ? undefined : videoHeight,
			},
		});
		this.video.nativeElement.srcObject = stream;

		return new Promise((resolve) => {
			this.video.nativeElement.onloadedmetadata = () => {
				resolve(this.video.nativeElement);
			};
		});
	}

	async loadVideo() {
		const video = await this.setupCamera();
		return video;
	}

	defaultQuantBytes = 2;
	defaultResNetMultiplier = 1.0;
	defaultResNetStride = 32;
	defaultResNetInputResolution = 257;

	guiState = {
		algorithm: 'multi-pose',
		input: {
			architecture: 'MobileNetV1',
			quantBytes: this.defaultQuantBytes
		},
		singlePoseDetection: {
			minPoseConfidence: 0.1,
			minPartConfidence: 0.5,
		},
		multiPoseDetection: {
			maxPoseDetections: 5,
			minPoseConfidence: 0.15,
			minPartConfidence: 0.1,
			nmsRadius: 30.0,
		},
		output: {
			showVideo: true,
			showSkeleton: true,
			showPoints: true,
		},
		net: null,
	};


	/**
	 * Sets up dat.gui controller on the top-right of the window
	 */
	setupGui(cameras, net) {
		this.guiState.net = net;

		const gui = new dat.GUI({
			width: 300
		});

		// if (cameras.length > 0) {
		// 	this.guiState.camera = cameras[0].deviceId;
		// }

		let architectureController = null;
		this.guiState[this.demo.tryResNetButtonName] = function () {
			architectureController.setValue('ResNet50')
		};
		gui.add(this.guiState, this.demo.tryResNetButtonName).name(this.demo.tryResNetButtonText);

		// The single-pose algorithm is faster and simpler but requires only one
		// person to be in the frame or results will be innaccurate. Multi-pose works
		// for more than 1 person
		const algorithmController =
			gui.add(this.guiState, 'algorithm', ['single-pose', 'multi-pose']);

		// The input parameters have the most effect on accuracy and speed of the
		// network
		let input = gui.addFolder('Input');
		// Architecture: there are a few PoseNet models varying in size and
		// accuracy. 1.01 is the largest, but will be the slowest. 0.50 is the
		// fastest, but least accurate.
		architectureController =
			input.add(this.guiState.input, 'architecture', ['MobileNetV1', 'ResNet50']);
		this.guiState.input.architecture = this.guiState.input.architecture;
		// Input resolution:  Internally, this parameter affects the height and width
		// of the layers in the neural network. The higher the value of the input
		// resolution the better the accuracy but slower the speed.
		let inputResolutionController = null;

		function updateGuiInputResolution(
			inputResolution,
			inputResolutionArray,
		) {
			if (inputResolutionController) {
				inputResolutionController.remove();
			}
			this.guiState.inputResolution = inputResolution;
			this.guiState.input.inputResolution = inputResolution;
			inputResolutionController =
				input.add(this.guiState.input, 'inputResolution', inputResolutionArray);
			inputResolutionController.onChange(function (inputResolution) {
				this.guiState.changeToInputResolution = inputResolution;
			});
		}

		// Output stride:  Internally, this parameter affects the height and width of
		// the layers in the neural network. The lower the value of the output stride
		// the higher the accuracy but slower the speed, the higher the value the
		// faster the speed but lower the accuracy.
		let outputStrideController = null;

		function updateGuiOutputStride(outputStride, outputStrideArray) {
			if (outputStrideController) {
				outputStrideController.remove();
			}
			this.guiState.outputStride = outputStride;
			this.guiState.input.outputStride = outputStride;
			outputStrideController =
				input.add(this.guiState.input, 'outputStride', outputStrideArray);
			outputStrideController.onChange(function (outputStride) {
				this.guiState.changeToOutputStride = outputStride;
			});
		}

		// Multiplier: this parameter affects the number of feature map channels in
		// the MobileNet. The higher the value, the higher the accuracy but slower the
		// speed, the lower the value the faster the speed but lower the accuracy.
		let multiplierController = null;

		function updateGuiMultiplier(multiplier, multiplierArray) {
			if (multiplierController) {
				multiplierController.remove();
			}
			this.guiState.multiplier = multiplier;
			this.guiState.input.multiplier = multiplier;
			multiplierController =
				input.add(this.guiState.input, 'multiplier', multiplierArray);
			multiplierController.onChange(function (multiplier) {
				this.guiState.changeToMultiplier = multiplier;
			});
		}

		// QuantBytes: this parameter affects weight quantization in the ResNet50
		// model. The available options are 1 byte, 2 bytes, and 4 bytes. The higher
		// the value, the larger the model size and thus the longer the loading time,
		// the lower the value, the shorter the loading time but lower the accuracy.
		let quantBytesController = null;

		function updateGuiQuantBytes(quantBytes, quantBytesArray) {
			if (quantBytesController) {
				quantBytesController.remove();
			}
			this.guiState.quantBytes = +quantBytes;
			this.guiState.input.quantBytes = +quantBytes;
			quantBytesController =
				input.add(this.guiState.input, 'quantBytes', quantBytesArray);
			quantBytesController.onChange(function (quantBytes) {
				this.guiState.changeToQuantBytes = +quantBytes;
			});
		}

		function updateGui() {
			if (this.guiState.input.architecture === 'MobileNetV1') {
				updateGuiInputResolution(
					this.defaultMobileNetInputResolution, [257, 353, 449, 513, 801]);
				updateGuiOutputStride(this.defaultMobileNetStride, [8, 16]);
				updateGuiMultiplier(this.defaultMobileNetMultiplier, [0.50, 0.75, 1.0]);
			} else {
				this.guiState.input.architecture === "ResNet50";
				updateGuiInputResolution(this.defaultResNetInputResolution, [257, 353, 449, 513, 801]);
				updateGuiOutputStride(this.defaultResNetStride, [32, 16]);
				updateGuiMultiplier(this.defaultResNetMultiplier, [1.0]);
				updateGuiQuantBytes(this.defaultQuantBytes, [1, 2, 4]);
			}

			updateGui();
			input.open();
			// Pose confidence: the overall confidence in the estimation of a person's
			// pose (i.e. a person detected in a frame)
			// Min part confidence: the confidence that a particular estimated keypoint
			// position is accurate (i.e. the elbow's position)
			let single = gui.addFolder('Single Pose Detection');
			single.add(this.guiState.singlePoseDetection, 'minPoseConfidence', 0.0, 1.0);
			single.add(this.guiState.singlePoseDetection, 'minPartConfidence', 0.0, 1.0);

			let multi = gui.addFolder('Multi Pose Detection');
			multi.add(this.guiState.multiPoseDetection, 'maxPoseDetections')
				.min(1)
				.max(20)
				.step(1);
			multi.add(this.guiState.multiPoseDetection, 'minPoseConfidence', 0.0, 1.0);
			multi.add(this.guiState.multiPoseDetection, 'minPartConfidence', 0.0, 1.0);
			// nms Radius: controls the minimum distance between poses that are returned
			// defaults to 20, which is probably fine for most use cases
			multi.add(this.guiState.multiPoseDetection, 'nmsRadius').min(0.0).max(40.0);
			multi.open();

			let output = gui.addFolder('Output');
			output.add(this.guiState.output, 'showVideo');
			output.add(this.guiState.output, 'showSkeleton');
			output.add(this.guiState.output, 'showPoints');
			output.add(this.guiState.output, 'showBoundingBox');
			output.open();


			architectureController.onChange(function (architecture) {
				// if architecture is ResNet50, then show ResNet50 options
				updateGui();
				this.guiState.changeToArchitecture = architecture;
			});

			algorithmController.onChange(function (value) {
				single.close();
				multi.open();
			});
		}
	}

	/**
	 * Sets up a frames per second panel on the top-left of the window
	 */
	//   setupFPS() {
	// 	this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
	// 	document.getElementById('main').appendChild(stats.dom);
	//   }

	/**
	 * Feeds an image to posenet to estimate poses - this is where the magic
	 * happens. This function loops with a requestAnimationFrame method.
	 */

	detectPoseInRealTime(video, net) {
		this.context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');

		// since images are being fed from a webcam, we want to feed in the
		// original image and then just flip the keypoints' x coordinates. If instead
		// we flip the image, then correcting left-right keypoint pairs requires a
		// permutation on all the keypoints.
		const flipPoseHorizontal = true;
		this.canvas.nativeElement.width = this.constraints.video.width;
		this.canvas.nativeElement.height = this.constraints.video.height;

		async function poseDetectionFrame() {
			console.log("This works hello");
			// if (this.guiState.changeToArchitecture) {
			// 	// Important to purge variables and free up GPU memory
			// 	this.guiState.net.dispose();
			// 	this.guiState.net = await posenet.load({
			// 		architecture: this.guiState.changeToArchitecture,
			// 		outputStride: this.guiState.outputStride,
			// 		inputResolution: this.guiState.inputResolution,
			// 		multiplier: this.guiState.multiplier,
			// 	});
			// 	this.guiState.architecture = this.guiState.changeToArchitecture;
			// 	this.guiState.changeToArchitecture = null;
			// }

			console.log("what is going on");

			// if (this.guiState.changeToMultiplier) {
			//   this.guiState.net.dispose();
			//   this.guiState.net = await posenet.load({
			// 	architecture: this.guiState.architecture,
			// 	outputStride: this.guiState.outputStride,
			// 	inputResolution: this.guiState.inputResolution,
			// 	multiplier: +this.guiState.changeToMultiplier,
			// 	quantBytes: this.guiState.quantBytes
			//   });
			//   this.guiState.multiplier = +this.guiState.changeToMultiplier;
			//   this.guiState.changeToMultiplier = null;
			// }

			// if (this.guiState.changeToOutputStride) {
			//   // Important to purge variables and free up GPU memory
			//   this.guiState.net.dispose();
			//   this.guiState.net = await posenet.load({
			// 	architecture: this.guiState.architecture,
			// 	outputStride: +this.guiState.changeToOutputStride,
			// 	inputResolution: this.guiState.inputResolution,
			// 	multiplier: this.guiState.multiplier,
			// 	quantBytes: this.guiState.quantBytes
			//   });
			//   this.guiState.outputStride = +this.guiState.changeToOutputStride;
			//   this.guiState.changeToOutputStride = null;
			// }

			// if (this.guiState.changeToInputResolution) {
			//   // Important to purge variables and free up GPU memory
			//   this.guiState.net.dispose();
			//   this.guiState.net = await posenet.load({
			// 	architecture: this.guiState.architecture,
			// 	outputStride: this.guiState.outputStride,
			// 	inputResolution: +this.guiState.changeToInputResolution,
			// 	multiplier: this.guiState.multiplier,
			// 	quantBytes: this.guiState.quantBytes
			//   });
			//   this.guiState.inputResolution = +this.guiState.changeToInputResolution;
			//   this.guiState.changeToInputResolution = null;
			// }

			// if (this.guiState.changeToQuantBytes) {
			// 	// Important to purge variables and free up GPU memory
			// 	this.guiState.net.dispose();
			// 	this.guiState.net = await posenet.load({
			// 		architecture: this.guiState.architecture,
			// 		outputStride: this.guiState.outputStride,
			// 		inputResolution: this.guiState.inputResolution,
			// 		multiplier: this.guiState.multiplier,
			// 		quantBytes: this.guiState.changeToQuantBytes
			// 	});
			// 	this.guiState.quantBytes = this.guiState.changeToQuantBytes;
			// 	this.guiState.changeToQuantBytes = null;
			// }

			// Begin monitoring code for frames per second
			// this.stats.begin();

			console.log("This works #2");
			let poses = [];
			let minPoseConfidence;
			let minPartConfidence;
			// switch (this.guiState.algorithm) {
			// case 'single-pose':
			// 	const pose = await this.guiState.net.estimatePoses(video, {
			// 		flipHorizontal: flipPoseHorizontal,
			// 		decodingMethod: 'single-person'
			// 	});
			// 	poses = poses.concat(pose);
			// 	minPoseConfidence = +this.guiState.singlePoseDetection.minPoseConfidence;
			// 	minPartConfidence = +this.guiState.singlePoseDetection.minPartConfidence;
			// 	break;
			// case 'multi-pose':
			console.log("this works 3#");
			let all_poses = await this.guiState.net.estimatePoses(video, {
				flipHorizontal: false,
				decodingMethod: 'multi-person',
				maxDetections: 5,
				scoreThreshold: 1,
				nmsRadius: 30
			});
			console.log("ahahahahaha");

			poses = poses.concat(all_poses);
			minPoseConfidence = +this.guiState.multiPoseDetection.minPoseConfidence;
			minPartConfidence = +this.guiState.multiPoseDetection.minPartConfidence;

			console.log("hope this works correct");
			this.context.clearRect(0, 0, this.constraints.video.width, this.constraints.video.height);
			console.log("#4");
			if (this.guiState.output.showVideo) {
				this.context.save();
				this.context.scale(-1, 1);
				this.context.translate(-this.constraints.video.width, 0);
				this.context.drawImage(video, 0, 0, this.constraints.video.width, this.constraints.video.height);
				this.context.restore();
			}

			// For each pose (i.e. person) detected in an image, loop through the poses
			// and draw the resulting skeleton and keypoints if over certain confidence
			// scores
			poses.forEach(({
				score,
				keypoints
			}) => {
				if (score >= minPoseConfidence) {
					if (this.guiState.output.showPoints) {
						this.drawKeypoints(keypoints, minPartConfidence, this.context);
					}
					if (this.guiState.output.showSkeleton) {
						this.drawSkeleton(keypoints, minPartConfidence, this.context);
					}
					if (this.guiState.output.showBoundingBox) {
						this.drawBoundingBox(keypoints, this.context);
					}
				}
			});
			// End monitoring code for frames per second
			this.stats.end();
			requestAnimationFrame(poseDetectionFrame);
		}
		poseDetectionFrame();
	}


	/**
	 * Kicks off the demo by loading the posenet model, finding and loading
	 * available camera devices, and setting off the detectPoseInRealTime function.
	 */
	async bindPage() {
		const net = await posenet.load({
			architecture: 'MobileNetV1',
			quantBytes: 2,
			outputStride: 32,
			multiplier: 1,
			inputResolution: 257
		});

		let video;

		try {
			video = await this.loadVideo();
		} catch (e) {
			console.log(e);
		}

		this.setupGui([], net);
		// setupFPS();
		this.detectPoseInRealTime(this.video.nativeElement, net);
	}

}