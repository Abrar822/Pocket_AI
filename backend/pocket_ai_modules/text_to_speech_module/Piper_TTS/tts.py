import subprocess
import time
import sounddevice as sd
import soundfile as sf


class TextToSpeechModule:

    def tts(self, text: str):
        PIPER_EXE = (
            r"backend\pocket_ai_modules\text_to_speech_module\Piper_TTS\piper\piper.exe"
        )

        MODEL = (
            r"backend\pocket_ai_modules\text_to_speech_module\Piper_TTS\voices\en_US-ryan-medium.onnx"
        )

        OUTPUT = "output.wav"

        print("Generating speech...")

        start = time.perf_counter()

        subprocess.run(
            [
                PIPER_EXE,
                "--model",
                MODEL,
                "--output_file",
                OUTPUT,
            ],
            input=text,
            text=True,
            check=True,
        )

        end = time.perf_counter()

        print(f"\nTime Taken: {end - start:.3f} seconds")

        print("\nPlaying...")

        audio, sample_rate = sf.read(OUTPUT)

        sd.play(audio, sample_rate)
        sd.wait()

        print("\nFinished.")


# if __name__ == "__main__":
    # tts = TextToSpeechModule()
# Obj = TextToSpeechModule()
# Obj.tts("Hello Zeel, I wanted to tell you that you are Gay. hahahaha")