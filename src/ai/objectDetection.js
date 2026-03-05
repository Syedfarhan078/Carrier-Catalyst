// objectDetection.js
// Uses COCO-SSD (Common Objects in Context - Single Shot MultiBox Detector)
// via TensorFlow.js for detecting phones, multiple persons, and other suspicious objects

let cocoSsdModel = null;
let isModelLoading = false;

// COCO-SSD class names we care about for proctoring
const SUSPICIOUS_OBJECTS = ['cell phone', 'book', 'laptop', 'tablet'];
const PERSON_CLASS = 'person';

/**
 * Load the COCO-SSD object detection model
 * COCO-SSD can detect 80 object categories including phones and persons
 */
export const loadObjectDetectionModel = async () => {
  if (cocoSsdModel) return cocoSsdModel;
  if (isModelLoading) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (cocoSsdModel) {
          clearInterval(interval);
          resolve(cocoSsdModel);
        }
      }, 100);
    });
  }

  try {
    isModelLoading = true;
    const cocoSsd = await import('@tensorflow-models/coco-ssd');
    const tf = await import('@tensorflow/tfjs');
    await tf.ready();
    cocoSsdModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
    console.log('[ObjectDetection] COCO-SSD model loaded successfully');
    isModelLoading = false;
    return cocoSsdModel;
  } catch (error) {
    isModelLoading = false;
    console.error('[ObjectDetection] Failed to load COCO-SSD:', error);
    throw error;
  }
};

/**
 * Detect objects in video frame
 * @param {HTMLVideoElement} videoElement
 * @param {number} minConfidence - minimum detection confidence (0-1)
 * @returns {Promise<{detections: Array, hasPhone: boolean, personCount: number, hasSuspiciousObject: boolean}>}
 */
export const detectObjects = async (videoElement, minConfidence = 0.6) => {
  if (!videoElement || videoElement.readyState < 2) {
    return {
      detections: [],
      hasPhone: false,
      personCount: 0,
      hasSuspiciousObject: false,
      suspiciousItems: []
    };
  }

  try {
    const model = await loadObjectDetectionModel();
    if (!model) throw new Error('Model not loaded');

    const predictions = await model.detect(videoElement, undefined, minConfidence);

    const detections = predictions.map(p => ({
      class: p.class,
      score: Math.round(p.score * 100),
      bbox: p.bbox // [x, y, width, height]
    }));

    const hasPhone = detections.some(d =>
      d.class === 'cell phone' && d.score >= 55
    );

    const personDetections = detections.filter(d => d.class === PERSON_CLASS);
    const personCount = personDetections.length;

    const suspiciousItems = detections.filter(d =>
      SUSPICIOUS_OBJECTS.includes(d.class) && d.score >= 55
    );

    return {
      detections,
      hasPhone,
      personCount,
      hasSuspiciousObject: suspiciousItems.length > 0,
      suspiciousItems
    };
  } catch (error) {
    console.error('[ObjectDetection] Detection error:', error);
    return {
      detections: [],
      hasPhone: false,
      personCount: 0,
      hasSuspiciousObject: false,
      suspiciousItems: [],
      error: error.message
    };
  }
};

/**
 * Draw bounding boxes on canvas overlay for debug visualization
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} detections
 */
export const drawDetections = (ctx, detections) => {
  detections.forEach(det => {
    const [x, y, w, h] = det.bbox;
    const isSuspicious = SUSPICIOUS_OBJECTS.includes(det.class) || det.class === PERSON_CLASS;

    ctx.strokeStyle = isSuspicious ? '#ff4444' : '#00ff88';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = isSuspicious ? '#ff4444' : '#00ff88';
    ctx.font = '11px monospace';
    ctx.fillText(`${det.class} (${det.score}%)`, x, y > 15 ? y - 4 : y + 14);
  });
};

/**
 * Start continuous object monitoring
 * @param {HTMLVideoElement} videoElement
 * @param {Function} onDetection - callback({ hasPhone, personCount, suspiciousItems })
 * @param {number} intervalMs
 * @returns {Function} stop function
 */
export const startObjectMonitoring = (videoElement, onDetection, intervalMs = 3000) => {
  let running = true;

  const monitor = async () => {
    if (!running) return;

    const result = await detectObjects(videoElement);
    onDetection(result);

    setTimeout(monitor, intervalMs);
  };

  monitor();
  return () => { running = false; };
};