import re
import shutil
from datetime import datetime


def reformat_lines(in_path):
    # s_now = datetime.now().strftime("%Y%m%d%H%M%S")
    s_now = datetime.now().strftime("%Y%m%d")
    s_bak_path = in_path.replace("/vocabFarsi", "/bak/vocabFarsi")
    s_bak_path = s_bak_path + "." + s_now + ".bak.txt"
    shutil.copy(in_path, s_bak_path)

    s_out = ""
    with (open(in_path, "r", encoding="utf-8") as infile):
        for s_line in infile:
            # check if the s_line contains a pipe character
            if s_line == "\n" or s_line.startswith("#") or s_line.startswith("let") or len(s_line) == 0 :
                s_out += s_line
            else:
                s_line_without_fixes = s_line
                s_line = s_line \
                    .replace("ā", "aa") \
                    .replace("â", "aa") \
                    .replace("û", "oo") \
                    .replace(r"•", "") \
                    .replace(r"[ ]*\|[ ]*", " | ") \
                    .lstrip(" \t")
                s_line = re.sub(r"\s*\|\s*", "|", s_line)
                s_line = re.sub(r"\.$", "", s_line)
                s_line = re.sub(r"\.\s{4,4}", "     ", s_line)
                as_line = re.split(r',*\s{2,}|\||\t|:', s_line)
                if len(as_line) > 2:
                    as_line = [as_line[0], " ".join(as_line[1:])]
                if len(as_line) == 2:
                    as_line[0] = as_line[0].ljust(52) + "    "
                    s_line = as_line[0] + as_line[1].strip() + "\n"
                if s_line != s_line_without_fixes:
                    # only lowercase once in case "I" exists.
                    s_line = s_line.lower()
                    s_line = re.sub(r"\bi\b", "I", s_line, flags=re.IGNORECASE)
                s_out += s_line
    with open(in_path, 'w', encoding='utf-8') as file:
        file.write(s_out)


if __name__ == "__main__":
    # variables for the file name and path
    as_file_in_path = [
        "web/data/vocabFarsi.0.js",
        "web/data/vocabFarsi.1.js"
    ]
    for ix in range(len(as_file_in_path)):
        s_file_in_path = as_file_in_path[ix]
        reformat_lines(s_file_in_path)
