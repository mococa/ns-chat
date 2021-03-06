// External
import Nullstack from 'nullstack';

// Icons
import Mic from '../../assets/icons/mic';
import Stop from '../../assets/icons/stop';
import Attach from '../../assets/icons/attach';
import Send from '../../assets/icons/send';

// Components
import RoundButton from '../RoundButton';

// Helpers
import { uploadFile } from '../../helpers/uploadFile';
import { recordAudio } from '../../helpers/recordAudio';
import { blobToBase64 } from '../../helpers/blobToBase64';
import { getInlineTransferLink } from '../../helpers/getInlineTransferLink';

// Styles
import './styles.scss';

class MessageInput extends Nullstack {
  // States
  state = {
    value: '',
    mediaRecorder: null,
    recording: false,
    audio: undefined,
    uplodingAudio: false,
    attachment: undefined,
    uploadingFile: false,
  };

  // Handlers
  handleOnChange({ event }) {
    this.state.value = event.target.value;
    // if (this.value) this.onType({ value: this.value });
    // else this.onStopTyping();
  }

  handleOnSubmit({ event }) {
    if (event.key !== 'Enter') return;
    this.handleSendMessage();
  }

  handleSendMessage() {
    this.onSend({
      data: {
        text: this.state.value,
        ...(this.state.audio && { audio: this.state.audio?.onlineUrl }),
        ...(this.state.attachment && {
          attachment: this.state.attachment?.onlineUrl,
        }),
      },
    });

    this.state.attachment = undefined;
    this.state.audio = undefined;
    this.state.value = '';
  }

  handleOnRecordClick() {
    return this.state.recording
      ? this.handleStopRecordingAudio()
      : this.handleRecordAudio();
  }

  async handleRecordAudio() {
    const self = this;
    this.state.recording = true;
    const recorder = await recordAudio();
    this.handleOnRecordClick = () => {
      self.handleStopRecordingAudio(recorder);
    };
  }

  async handleStopRecordingAudio(recorder) {
    this.state.recording = false;
    const audio = await recorder.stop();
    this.state.audio = audio;
    this.state.uplodingAudio = true;

    this.handleOnRecordClick = () => {
      if (this.state.audio) {
        this.state.recording = false;
        this.state.audio = null;
        return;
      }

      this.state.audio = null;
      this.handleRecordAudio();
    };

    const onlineUrl = await uploadFile(audio.data, 'webm').then(({ data }) =>
      data.trim()
    );

    if (this.state.audio) this.state.audio.onlineUrl = onlineUrl;
    if (this.state.uplodingAudio) this.state.uplodingAudio = false;
  }

  handleUpload({ event }) {
    this.state.uploadingFile = true;
    const fr = new FileReader();
    const file = event.target.files[0];

    fr.readAsArrayBuffer(file);
    fr.onload = async () => {
      const blob = new Blob([fr.result]);
      const binary = await blobToBase64(blob);
      const extension = file.name.split('.').at(-1);
      const onlineUrl = await uploadFile(binary, extension).then(({ data }) =>
        getInlineTransferLink(data.trim())
      );
      this.state.uploadingFile = false;
      this.state.attachment = {
        onlineUrl,
        name: file.name,
      };
    };
  }

  // Renders
  renderInput() {
    return (
      <input
        oninput={this.handleOnChange}
        onkeyup={this.handleOnSubmit}
        value={this.state.value}
        placeholder="Type something to send"
        autofocus
      />
    );
  }

  renderActionButtons() {
    return (
      <div class={`action-buttons${this.state.audio ? ' with-audio' : ''}`}>
        <RoundButton onclick={this.handleOnRecordClick}>
          {this.state.recording ? <Stop /> : <Mic />}
        </RoundButton>
        <input type="file" id="file-upload" onchange={this.handleUpload} />
        <RoundButton
          onclick={() => {
            document.querySelector('#file-upload').click();
          }}
        >
          <Attach />
        </RoundButton>
        <RoundButton
          onclick={this.handleSendMessage}
          primary
          disabled={
            this.state.uploadingFile ||
            (this.state.audio && !this.state.audio.onlineUrl) ||
            this.state.recording
          }
        >
          {this.state.audio && !this.state.audio.onlineUrl ? (
            <img
              src="data:image/svg+xml;base64,PCEtLSBCeSBTYW0gSGVyYmVydCAoQHNoZXJiKSwgZm9yIGV2ZXJ5b25lLiBNb3JlIEAgaHR0cDovL2dvby5nbC83QUp6YkwgLS0+DQo8c3ZnIHdpZHRoPSIzOCIgaGVpZ2h0PSIzOCIgdmlld0JveD0iMCAwIDQwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxkZWZzPg0KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjguMDQyJSIgeTE9IjAlIiB4Mj0iNjUuNjgyJSIgeTI9IjIzLjg2NSUiIGlkPSJhIj4NCiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMyMjIiIHN0b3Atb3BhY2l0eT0iMCIgb2Zmc2V0PSIwJSIvPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzIyMiIgc3RvcC1vcGFjaXR5PSIuNjMxIiBvZmZzZXQ9IjYzLjE0NiUiLz4NCiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMyMjIiIG9mZnNldD0iMTAwJSIvPg0KICAgICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgIDwvZGVmcz4NCiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPg0KICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxIDEpIj4NCiAgICAgICAgICAgIDxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgaWQ9Ik92YWwtMiIgc3Ryb2tlPSJ1cmwoI2EpIiBzdHJva2Utd2lkdGg9IjQiPg0KICAgICAgICAgICAgICAgIDxhbmltYXRlVHJhbnNmb3JtDQogICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSINCiAgICAgICAgICAgICAgICAgICAgdHlwZT0icm90YXRlIg0KICAgICAgICAgICAgICAgICAgICBmcm9tPSIwIDE4IDE4Ig0KICAgICAgICAgICAgICAgICAgICB0bz0iMzYwIDE4IDE4Ig0KICAgICAgICAgICAgICAgICAgICBkdXI9IjAuOXMiDQogICAgICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPg0KICAgICAgICAgICAgPC9wYXRoPg0KICAgICAgICAgICAgPGNpcmNsZSBmaWxsPSIjMjIyIiBjeD0iMzYiIGN5PSIxOCIgcj0iMSI+DQogICAgICAgICAgICAgICAgPGFuaW1hdGVUcmFuc2Zvcm0NCiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIg0KICAgICAgICAgICAgICAgICAgICB0eXBlPSJyb3RhdGUiDQogICAgICAgICAgICAgICAgICAgIGZyb209IjAgMTggMTgiDQogICAgICAgICAgICAgICAgICAgIHRvPSIzNjAgMTggMTgiDQogICAgICAgICAgICAgICAgICAgIGR1cj0iMC45cyINCiAgICAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+DQogICAgICAgICAgICA8L2NpcmNsZT4NCiAgICAgICAgPC9nPg0KICAgIDwvZz4NCjwvc3ZnPg0K"
              height="24"
              width="24"
            />
          ) : (
            <Send />
          )}
        </RoundButton>
      </div>
    );
  }

  render({ onSend }) {
    this.onSend = onSend;

    return (
      <div class="message-input-container">
        <Input />
        {this.state.audio && (
          <audio
            preload
            controls
            src={this.state.audio.audioUrl}
            type="audio/mpeg"
          />
        )}
        {this.state.attachment && (
          <span>{this.state.attachment.name.slice(0, 10)}...</span>
        )}
        <ActionButtons />
      </div>
    );
  }
}

export default MessageInput;
