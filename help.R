# create posts
hugo new  --kind post post/interested-in-trying-VR

# add authors
hugo new --kind authors authors/Zoe_Hakonsson

# add publications
academic import --bibtex content/authors/jacob-hl/of-publications.bib

# add projects
hugo new  --kind project project/of-psychometric-psfms

# add talks
hugo new  --kind event event/20220404-test

# add event: Oral Presentation or Poster
hugo new  --kind event event/test

# add event: Oral Presentation or Poster
hugo new  --kind event event/test

# miscellaneous
# internal links - folder before
# [Dr. Furtado](../ovande-furtado-jr/).

# insert tweets in inline
{{< tweet 1430671679236104196 >}}

# to mention an author
{{% mention "username" %}}

# to update theme - use the terminal
hugo mod get -u
hugo mod get -u ./... # latest developments