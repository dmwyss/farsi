import re



def reformat_lines(in_path, out_path):
    with open(in_path, "r", encoding="utf-8") as infile, open(out_path, "w", encoding="utf-8") as outfile:
        for line in infile:
            # check if the line contains a pipe character
            if len(line) == 0 or line.startswith("#") or line.startswith("let"):
                outfile.write(line)
            else:
                as_line = re.split(r'\s{2,}|\||,', line)
                if len(as_line) == 2:
                    as_line[0] = as_line[0].ljust(52) + "    "
                    line = as_line[0] + as_line[1].strip() + "\n"
                outfile.write(line)


if __name__ == "__main__":
    # variables for the file name and path
    ix_ = 0
    for i in range(2):
        input_file_path = f"web/data/vocabFarsi.{ix_}.js"
        output_file_path = f"web/data/vocabFarsi.{ix_}.bak.txt"
        reformat_lines(input_file_path, output_file_path)
