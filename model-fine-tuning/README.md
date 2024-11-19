# Mistral Model LoRA Fine Tuning
We used the MLX LoRA library to fine-tune the open source Mistral model on the investing resources available on the Commonwealth Government's [moneysmart website](https://moneysmart.gov.au/).

Stored within this directory is two different trainig approaches. Training_2 create the best results.

## Requirements
- Ollama installed as a local application, including CLI functionality.
- The mlx-lm and mlx Python libraries.

## Instructions to fine tune
1. Navigate to a specific directory where the adapters will be saved.
2. Execute `mlx_lm.lora --model mlx-community/Mistral-7B-Instruct-v0.2-4bit --train --iters 600 --batch-size 2 --data data`

## Instructions to create new Ollama model
The fine tuning command above creates a series of safetensor adapters, which you can then use to create a new Ollama model.
1. Navigate to the same directory as above.
2. Create a file called `modelfile` with the following contents:
```
FROM mistral
ADAPTER ./adapters
```
2. Execute `ollama create FinAdviceINST -f modelfile`