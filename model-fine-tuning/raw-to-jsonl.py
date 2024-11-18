import os
import json

def transform_raw_txt_to_jsonl(input_dir, output_file):
    with open(output_file, 'w') as outfile:
        for filename in os.listdir(input_dir):
            if filename.endswith('.txt'):
                with open(os.path.join(input_dir, filename), 'r') as infile:
                    for line in infile:
                        line = line.strip()
                        if line:  # Ignore blank lines
                            transformed_data = {"text": line}
                            outfile.write(json.dumps(transformed_data) + '\n')

if __name__ == "__main__":
    input_dir = 'data/raw_txt'
    output_file = 'data/raw_transformed_data.jsonl'
    transform_raw_txt_to_jsonl(input_dir, output_file)