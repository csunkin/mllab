# create posts
hugo new  --kind post post/interested-in-trying-VR

# add authors
hugo new --kind authors authors/belle-pearl

# add publications
academic import --bibtex content/authors/rosa-angulo-barroso/rosa-angulo-barroso-2021.04.23.bib

# add projects
hugo new  --kind project project/of-psychometric-psfms

# add talks
hugo new  --kind event event/2015-wskw-dobbs-kohli

# miscellaneous
# internal links - folder before
# [Dr. Furtado](../ovande-furtado-jr/).

# insert tweets in inline
{{< tweet 1430671679236104196 >}}

# to mention an author
{{% mention "username" %}}