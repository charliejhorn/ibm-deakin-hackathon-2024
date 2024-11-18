import json

def transform_data(input_file, output_file):
    with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
        for line in infile:
            data = json.loads(line)
            transformed_data = {"text": data["response"]}
            outfile.write(json.dumps(transformed_data) + '\n')

if __name__ == "__main__":
    input_file = '/Users/cjhorn/code/holder-ibm-deakin-hackathon/ibm-deakin-hackathon-2024/model-fine-tuning/data/all_data.jsonl'
    output_file = '/Users/cjhorn/code/holder-ibm-deakin-hackathon/ibm-deakin-hackathon-2024/model-fine-tuning/data/qna_transformed_data.jsonl'
    transform_data(input_file, output_file)
