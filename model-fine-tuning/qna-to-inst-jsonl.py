import json

def transform_qna_to_inst_jsonl(input_file, output_file, system_prompt_file):
    with open(system_prompt_file, 'r') as sp_file:
        system_prompt = sp_file.read().strip()
    
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        for line in infile:
            data = json.loads(line)
            prompt = data.get('instruction', '')
            response = data.get('response', '')
            transformed_data = {"text": f"<s>[INST] {system_prompt} - {prompt} [/INST]{response}</s>"}
            outfile.write(json.dumps(transformed_data) + '\n')

if __name__ == "__main__":
    input_file = 'raw_data/qna-moneysmart/all_data.jsonl'
    output_file = 'training_2/transformed_data.jsonl'
    system_prompt_file = 'system_prompt.txt'
    transform_qna_to_inst_jsonl(input_file, output_file, system_prompt_file)