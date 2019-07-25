import { Injectable } from "@angular/core";
import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";

@Injectable({
    // tslint:disable-next-line: indent
    providedIn: "root"
})
export class DemoUtilService {

    color: string;
    correctColor: string;
    markColor: string;
    lineWidth: number;

    tryResNetButtonName = 'tryResNetButton';
    tryResNetButtonText = '[New] Try ResNet50';

    constructor() {
        this.color = "aqua";
        this.correctColor = "red";
        this.markColor = "white";
        this.lineWidth = 2;
    }

    drawPoint(ctx, y, x, r, color) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    /**
     * Draws a line on a canvas, i.e. a joint
     */
    drawSegment([ay, ax], [by, bx], color, scale, ctx) {
        ctx.beginPath();
        ctx.moveTo(ax * scale, ay * scale);
        ctx.lineTo(bx * scale, by * scale);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }


    /**
     * Draws a pose skeleton by looking up all adjacent keypoints/joints
     */
    drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
        const adjacentKeyPoints =
            posenet.getAdjacentKeyPoints(keypoints, minConfidence);
        adjacentKeyPoints.forEach((keypoints) => {
            var ix: number = keypoints[0].position.x;
            var iy: number = keypoints[0].position.y;
            var jx: number = keypoints[1].position.x;
            var jy: number = keypoints[1].position.y;
            this.drawSegment(
                [iy, ix], [jy, jx], this.color,
                scale, ctx);
        });
    }

    /**
 * Draw pose keypoints onto a canvas
 */
    drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
        const LShoulder = {
            x: 249.6960461711326,
            y: 107.92127575790673
        };
        const RShoulder = {
            x: 350.77193636085553,
            y: 120.66025008932192
        };
        const LElbow = {
            x: 202.88377786379812,
            y: 115.53041976794862
        };
        const RElbow = {
            x: 418.485258358961,
            y: 134.60635832178662
        };
        const LWrist = {
            x: 134.5772854989035,
            y: 116.58905695753486
        };
        const RWrist = {
            x: 500.33848803782325,
            y: 139.0396084701805
        };
        const LHip = {
            x: 268.7275245398806,
            y: 280.9685779593841
        };
        const RHip = {
            x: 344.9351054409094,
            y: 286.1104245074311
        };
        const LKnee = {
            x: 185.99513178819802,
            y: 342.62615316792534
        };
        const RKnee = {
            x: 422.21701719049827,
            y: 377.776122790331
        };
        const LAnkle = {
            x: 182.6414406871238,
            y: 459.9953578926666
        };
        const RAnkle = {
            x: 506.139806022421,
            y: 461.90561941492626
        };

        for (let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];

            if (keypoint.score < minConfidence) {
                continue;
            }


            const {
                y,
                x
            } = keypoint.position;
            if ((y <= LShoulder.y + 30 && y > LShoulder.y - 30) && (x <= LShoulder.x + 30 && x > LShoulder.x - 30) && keypoint.part == "leftShoulder") {
                this.drawPoint(ctx, LShoulder.y * scale, LShoulder.x * scale, 10, this.correctColor);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);
            } else if ((y <= RShoulder.y + 30 && y > RShoulder.y - 30) && (x <= RShoulder.x + 30 && x > RShoulder.x - 30) && keypoint.part == "rightShoulder") {
                this.drawPoint(ctx, RShoulder.y * scale, RShoulder.x * scale, 10, this.correctColor);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);
            } else if ((y <= LElbow.y + 30 && y > LElbow.y - 30) && (x <= LElbow.x + 30 && x > LElbow.x - 30) && keypoint.part == "leftElbow") {
                this.drawPoint(ctx, LElbow.y * scale, LElbow.x * scale, 10, this.correctColor);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);

            } else if ((y <= RElbow.y + 30 && y > RElbow.y - 30) && (x <= RElbow.x + 30 && x > RElbow.x - 30) && keypoint.part == "rightElbow") {
                this.drawPoint(ctx, RElbow.y * scale, RElbow.x * scale, 10, this.correctColor);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);

            } else if ((y <= LWrist.y + 30 && y > LWrist.y - 30) && (x <= LWrist.x + 30 && x > LWrist.x - 30) && keypoint.part == "leftWrist") {
                this.drawPoint(ctx, LWrist.y * scale, LWrist.x * scale, 10, this.correctColor);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);

            } else if ((y <= RWrist.y + 30 && y > RWrist.y - 30) && (x <= RWrist.x + 30 && x > RWrist.x - 30) && keypoint.part == "rightWrist") {
                this.drawPoint(ctx, RWrist.y * scale, RWrist.x * scale, 10, this.correctColor);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);

            } else if ((y <= LHip.y + 30 && y > LHip.y - 30) && (x <= LHip.x + 30 && x > LHip.x - 30) && keypoint.part == "leftHip") {
                this.drawPoint(ctx, LHip.y * scale, LHip.x * scale, 10, this.correctColor);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);

            } else if ((y <= RHip.y + 30 && y > RHip.y - 30) && (x <= RHip.x + 30 && x > RHip.x - 30) && keypoint.part == "rightHip") {
                this.drawPoint(ctx, RHip.y * scale, RHip.x * scale, 10, RHip);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);
            } else if ((y <= LKnee.y + 30 && y > LKnee.y - 30) && (x <= LKnee.x + 30 && x > LKnee.x - 30) && keypoint.part == "leftKnee") {
                this.drawPoint(ctx, LKnee.y * scale, LKnee.x * scale, 10, this.correctColor);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);

            } else if ((y <= RKnee.y + 30 && y > RKnee.y - 30) && (x <= RKnee.x + 30 && x > RKnee.x - 30) && keypoint.part == "rightKnee") {
                this.drawPoint(ctx, RKnee.y * scale, RKnee.x * scale, 10, this.correctColor);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);

            } else if ((y <= LAnkle.y + 30 && y > LAnkle.y - 30) && (x <= LAnkle.x + 30 && x > LAnkle.x - 30) && keypoint.part == "leftAnkle") {
                this.drawPoint(ctx, LAnkle.y * scale, LAnkle.x * scale, 10, this.correctColor);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);
            } else if ((y <= RAnkle.y + 30 && y > RAnkle.y - 30) && (x <= RAnkle.x + 30 && x > RAnkle.x - 30) && keypoint.part == "rightAnkle") {
                this.drawPoint(ctx, RAnkle.y * scale, RAnkle.x * scale, 10, this.correctColor);
                this.drawPoint(ctx, y * scale, x * scale, 10, this.correctColor);
            } else {
                this.drawPoint(ctx, y * scale, x * scale, 3, this.color);
                this.drawPoint(ctx, LShoulder.y * scale, LShoulder.x * scale, 10, this.markColor);
                this.drawPoint(ctx, RShoulder.y * scale, RShoulder.x * scale, 10, this.markColor);
                this.drawPoint(ctx, LElbow.y * scale, LElbow.x * scale, 10, this.markColor);
                this.drawPoint(ctx, RElbow.y * scale, RElbow.x * scale, 10, this.markColor);
                this.drawPoint(ctx, LWrist.y * scale, LWrist.x * scale, 10, this.markColor);
                this.drawPoint(ctx, RWrist.y * scale, RWrist.x * scale, 10, this.markColor);
                this.drawPoint(ctx, LHip.y * scale, LHip.x * scale, 10, this.markColor);
                this.drawPoint(ctx, RHip.y * scale, RHip.x * scale, 10, this.markColor);
                this.drawPoint(ctx, LKnee.y * scale, LKnee.x * scale, 10, this.markColor);
                this.drawPoint(ctx, RKnee.y * scale, RKnee.x * scale, 10, this.markColor);
                this.drawPoint(ctx, LAnkle.y * scale, LAnkle.x * scale, 10, this.markColor);
                this.drawPoint(ctx, RAnkle.y * scale, RAnkle.x * scale, 10, this.markColor);
            }
        }
    }


    /**
     * Converts an arary of pixel data into an ImageData object
     */
    async renderToCanvas(a, ctx) {
        const [height, width] = a.shape;
        const imageData = new ImageData(width, height);

        const data = await a.data();

        for (let i = 0; i < height * width; ++i) {
            const j = i * 4;
            const k = i * 3;

            imageData.data[j + 0] = data[k + 0];
            imageData.data[j + 1] = data[k + 1];
            imageData.data[j + 2] = data[k + 2];
            imageData.data[j + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    /**
    * Draw an image on a canvas
    */
    renderImageToCanvas(image, size, canvas) {
        canvas.width = size[0];
        canvas.height = size[1];
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0);
    }

    /**
    * Draw heatmap values, one of the model outputs, on to the canvas
    * Read our blog post for a description of PoseNet's heatmap outputs
    * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
    */
    drawHeatMapValues(heatMapValues, outputStride, canvas) {
        const ctx = canvas.getContext('2d');
        const radius = 5;
        const scaledValues = heatMapValues.mul(tf.scalar(outputStride, 'int32'));

        this.drawPoints(ctx, scaledValues, radius, this.color);
    }

    /**
    * Used by the drawHeatMapValues method to draw heatmap points on to
    * the canvas
    */
    drawPoints(ctx, points, radius, color) {
        const data = points.buffer().values;

        for (let i = 0; i < data.length; i += 2) {
            const pointY = data[i];
            const pointX = data[i + 1];

            if (pointX !== 0 && pointY !== 0) {
                ctx.beginPath();
                ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
            }
        }
    }

    /**
    * Draw offset vector values, one of the model outputs, on to the canvas
    * Read our blog post for a description of PoseNet's offset vector outputs
    * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
    */
    // drawOffsetVectors(
    //     heatMapValues, offsets, outputStride, scale = 1, ctx) {
    //     const offsetPoints =
    //     posenet.singlePose.getOffsetPoints(heatMapValues, outputStride, offsets);

    //     const heatmapData = heatMapValues.buffer().values;
    //     const offsetPointsData = offsetPoints.buffer().values;

    //     for (let i = 0; i < heatmapData.length; i += 2) {
    //         const heatmapY = heatmapData[i] * outputStride;
    //         const heatmapX = heatmapData[i + 1] * outputStride;
    //         const offsetPointY = offsetPointsData[i];
    //         const offsetPointX = offsetPointsData[i + 1];

    //     this.drawSegment(
    //         [heatmapY, heatmapX], [offsetPointY, offsetPointX], this.color, scale, ctx);
    //     }
    //}
}
