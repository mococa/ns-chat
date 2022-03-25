// Helpers
import { blobToBase64 } from './blobToBase64';

export const recordAudio = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  return new Promise((resolve) => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    const audioChunks = [];
    mediaRecorder.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });

    const stop = () => {
      return new Promise((resolve) => {
        mediaRecorder.addEventListener('stop', async () => {
          const type = mediaRecorder.mimeType;
          const audioBlob = new Blob(audioChunks, { type });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          const data = await blobToBase64(audioBlob);
          resolve({
            audioBlob,
            audioUrl,
            play,
            data,
            type,
          });
        });

        stream.getTracks().forEach((track) => track.stop());
      });
    };
    const start = () => mediaRecorder.start();
    resolve({
      start,
      stop,
    });
  });
};
