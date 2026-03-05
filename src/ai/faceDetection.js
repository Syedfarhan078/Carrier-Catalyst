// faceDetection.js
// Uses @mediapipe/face_detection or TensorFlow.js BlazeFace model
// for real-time face monitoring during assessments

let faceDetectionModel = null;
let isModelLoading = false;

/**
 * Load the BlazeFace model from TensorFlow.js
 * BlazeFace is lightweight and fast, ideal for real-time detection
 */
export const loadFaceDetectionModel = async () => {
  if (faceDetectionModel) return faceDetectionModel;
  if (isModelLoading) {
    // Wait for model to finish loading
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (faceDetectionModel) {
          clearInterval(interval);
          resolve(faceDetectionModel);
        }
      }, 100);
    });
  }

  try {
    isModelLoading = true;
    // Dynamically import to avoid issues if TF.js isn't installed
    const blazeface = await import('@tensorflow-models/blazeface');
    const tf = await import('@tensorflow/tfjs');
    await tf.ready();
    faceDetectionModel = await blazeface.load();
    console.log('[FaceDetection] BlazeFace model loaded successfully');
    isModelLoading = false;
    return faceDetectionModel;
  } catch (error) {
    isModelLoading = false;
    console.error('[FaceDetection] Failed to load model:', error);
    throw error;
  }
};

/**
 * Detect faces in the given video element
 * @param {HTMLVideoElement} videoElement
 * @returns {Promise<{faceCount: number, predictions: Array, status: string}>}
 */
export const detectFaces = async (videoElement) => {
  if (!videoElement || videoElement.readyState < 2) {
    return { faceCount: 0, predictions: [], status: 'VIDEO_NOT_READY' };
  }

  try {
    const model = await loadFaceDetectionModel();
    if (!model) return { faceCount: 0, predictions: [], status: 'MODEL_NOT_LOADED' };

    const predictions = await model.estimateFaces(videoElement, false);

    const faceCount = predictions.length;
    let status = 'OK';

    if (faceCount === 0) {
      status = 'NO_FACE';
    } else if (faceCount > 1) {
      status = 'MULTIPLE_FACES';
    } else {
      // Check if face is looking away by analyzing facial landmarks
      const face = predictions[0];
      if (face.landmarks) {
        status = analyzeFaceOrientation(face);
      }
    }

    return { faceCount, predictions, status };
  } catch (error) {
    console.error('[FaceDetection] Detection error:', error);
    return { faceCount: -1, predictions: [], status: 'ERROR' };
  }
};

/**
 * Analyze face orientation using landmark positions
 * Landmarks order: [right eye, left eye, nose, mouth, right ear, left ear]
 * @param {Object} face - BlazeFace prediction object
 * @returns {string} status
 */
const analyzeFaceOrientation = (face) => {
  try {
    if (!face.landmarks || face.landmarks.length < 6) return 'OK';

    const rightEye = face.landmarks[0];
    const leftEye = face.landmarks[1];
    const nose = face.landmarks[2];
    const rightEar = face.landmarks[4];
    const leftEar = face.landmarks[5];

    // Calculate horizontal face ratio to detect left/right turn
    const faceWidth = face.bottomRight[0] - face.topLeft[0];
    const noseOffsetX = nose[0] - (face.topLeft[0] + faceWidth / 2);
    const normalizedOffset = Math.abs(noseOffsetX) / faceWidth;

    // If nose is significantly off-center, person is looking away
    if (normalizedOffset > 0.3) {
      return 'LOOKING_AWAY';
    }

    // Check vertical orientation (looking up/down)
    const faceHeight = face.bottomRight[1] - face.topLeft[1];
    const eyeMidY = (rightEye[1] + leftEye[1]) / 2;
    const noseOffsetY = nose[1] - eyeMidY;
    const normalizedVertical = noseOffsetY / faceHeight;

    if (normalizedVertical < 0.05 || normalizedVertical > 0.45) {
      return 'LOOKING_AWAY';
    }

    return 'OK';
  } catch {
    return 'OK';
  }
};

/**
 * Continuously monitor face in video stream
 * @param {HTMLVideoElement} videoElement
 * @param {Function} onStatusChange - callback(status, faceCount)
 * @param {number} intervalMs - detection interval
 * @returns {Function} stop function
 */
export const startFaceMonitoring = (videoElement, onStatusChange, intervalMs = 1500) => {
  let running = true;
  let consecutiveNoFaceFrames = 0;
  let consecutiveLookingAwayFrames = 0;

  const monitor = async () => {
    if (!running) return;

    const result = await detectFaces(videoElement);

    if (result.status === 'NO_FACE') {
      consecutiveNoFaceFrames++;
      consecutiveLookingAwayFrames = 0;
      // Only alert after 3+ consecutive no-face detections (~4.5s at 1500ms interval)
      if (consecutiveNoFaceFrames >= 3) {
        onStatusChange('NO_FACE', 0);
      }
    } else if (result.status === 'MULTIPLE_FACES') {
      consecutiveNoFaceFrames = 0;
      onStatusChange('MULTIPLE_FACES', result.faceCount);
    } else if (result.status === 'LOOKING_AWAY') {
      consecutiveLookingAwayFrames++;
      consecutiveNoFaceFrames = 0;
      // Alert after 4+ consecutive looking-away frames (~6s)
      if (consecutiveLookingAwayFrames >= 4) {
        onStatusChange('LOOKING_AWAY', 1);
      }
    } else {
      consecutiveNoFaceFrames = 0;
      consecutiveLookingAwayFrames = 0;
      onStatusChange('OK', result.faceCount);
    }

    setTimeout(monitor, intervalMs);
  };

  // Start monitoring
  monitor();

  // Return stop function
  return () => { running = false; };
};