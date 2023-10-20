# The commands below should be used in terminal

# create posts
hugo new  --kind post post/interested-in-trying-VR

# add authors
hugo new --kind authors authors/thomas-ruswick

# add publications
academic import --bibtex content/authors/jacob-hl/hl-publications.bib

# add projects
hugo new  --kind project project/of-psychometric-psfms

# add talks
hugo new  --kind event event/20220404-test

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

# only showing related under people
## the solution is to ensure all items have `authors` = <folder-name>

# temp
module github.com/wowchemy/starter-research-group

go 1.15

require (
  github.com/wowchemy/wowchemy-hugo-modules/wowchemy v0.0.0-20210209220000-aa4fe0c75726 // indirect
  github.com/wowchemy/wowchemy-hugo-modules/wowchemy-cms v0.0.0-20210209220000-aa4fe0c75726 // indirect
  github.com/wowchemy/wowchemy-hugo-themes/modules/wowchemy-core v0.1.0 // indirect
  github.com/wowchemy/wowchemy-hugo-themes/modules/wowchemy-plugin-netlify v1.0.0 // indirect
  github.com/wowchemy/wowchemy-hugo-themes/modules/wowchemy-plugin-netlify-cms v1.0.0 // indirect
  github.com/wowchemy/wowchemy-hugo-themes/modules/wowchemy-seo v0.1.0 // indirect
  github.com/wowchemy/wowchemy-hugo-themes/modules/wowchemy/v5 v5.7.0 // indirect
)
