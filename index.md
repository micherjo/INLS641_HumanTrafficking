
## Human Trafficking across the U.S.

Team Members: Laura Haller; Michelle Johnson; Stacy McDonald; Mara Negrut


# Introduction
Our project will highlight the horrific issue of Human Trafficking right here in the United States. The data will represent the number of reported human trafficking crimes by categories such as: specific type of trafficking crime, age of victim (minor or adult), ethnicity, and race. This would hopefully highlight the disparities between different groups when it comes to this type of crime. 

The ultimate goal of this project would be to create a visualization that could be used by any kind of law enforcement, non-profit, policymakers, or other organization that works to end human trafficking. Once the disparities are shown, the hope is that organizations can take this information and work in those specific communities to fix the problems that are leading to a higher instance of this crime. This visualization could not necessarily answer all of the larger, overarching societal questions, but could help to lead organizations in the right direction. The visualization could also be tailored to answer any specific question about the data depending on the user’s preference. 

We would like to dedicate a portion of our visualization to discussing what laws are in place in each US state. This way, policymakers could look at the numbers and see what clusters have in common when it comes to laws. This could more clearly illustrate what needs to be done to combat human trafficking from a legislative point of view. After all, policymakers are those who can affect the most real change when it comes to prevention of this crime. 

## Click below to view the visualization:
[![alt text](https://micherjo.github.io/INLS641_HumanTrafficking/map.png "link to map")](https://micherjo.github.io/INLS641_HumanTrafficking/about)
  
  
# Motivation
           
We are working within the domain of law enforcement, non-profits, and other organizations involved in policies to stop human trafficking. Our target users are therefore employees of these types of organizations that can use existing data in useful ways to plan strategically, make effective decisions, and see potential patterns or insights that can assist in furthering their mission.
 
By exploring data based on age, race/ethnicity, gender, type of crime (commercial sex acts or involuntary solitude), and the existing policies in US states and/or counties, the proposed visual analytics system would help to answer questions such as:
 
Are there any correlation between locations of higher/lower human trafficking and the location’s existing policies?
Are there any patterns or consistencies in the rate of human trafficking, the location, and the policies that exist in those locations?
Which of the four identifiers, or combination of identifiers listed above have the highest rate in human trafficking? Are Hispanic and Latino American minors more trafficked than any other race/age for example.
How has the rate of human trafficking changed over time in relation to those four identifiers? If there are changes, are there any correlation between policy changes (if any)?
 
It is hoped that our visualization will use the existing data available to expose the answers to these questions so that it might be useful to those fighting human trafficking. We are aware however, that not every police department or law enforcement agency is diligent in reporting all of their human trafficking statistics. If more analysis is done to this data in order to make it seem “worth” collecting, this could lead to a higher report rate by agencies.
           
While human trafficking is an uncomfortable and difficult topic for most people to discuss, we recognize that it is a horrifying and shocking type of crime that needs urgent attention. We are therefore interested to not only explore and discuss data on human trafficking, but to use that data to expose the many people being affected—young children, adults, male, female, of all races and ethnicities. These people might live in our own hometowns and in our own country; it is imperative that more is done to see these crimes, discuss them, and use the tools available to us—data and technology, to aid in the end of human trafficking.

# Data

## Dimensions of our data:
- State (about 30 states with complete data, about 2 states missing data)
- Years (2015-2019)
- Type of offense (2 categories: involuntary servitude and commercial sex acts)
- Sex (2 categories)
- Race (5 categories: white, black, AIAN, Asian, NHPI)
- Age (2 categories: juvenile vs adult)
- Number of offenses (normalized per 10M people)

All the datasets required for this project can be found on the FBI Uniform Crime Reporting (UCR) site. The data is gathered by the federal government from police departments throughout the United States. There is an entire section dedicated to human trafficking, and there are multiple relevant datasets that we plan to use. The datasets show reported cases based on type of crime, gender, race, ethnicity, and age group (minor vs. adult). Data is available for each year collected (currently from 2015 to 2018), so trends over time could also be analyzed if desired. The data is available in CSV files, and it will be stored as such in a shared Git repository that can be accessed by all group members, together with the rest of the project resources. The FBI datasets are missing data on some states due to underreporting of human trafficking cases, but this could help us to make a statement about the need to report these cases more regularly. In addition to the FBI data, there is also a global dataset of human trafficking reports available through the Counter Trafficking Data Collaborative (CTDC) website. This dataset includes information about the type of crime and age group of the victim, collected from 2002 through 2019. It is also available as a CSV file and could be used to supplement the FBI dataset, depending on what data needs emerge during our analysis.
We plan to display the data in two ways. One graph will be comparing states by showing the data as it is - in raw numbers. The other graph will show the data as percentages of a whole (ex: percentage of trafficked minors who identify as African American) by state. This will allow for easier comparison between states based on specific categories. We are also going to look at information about human trafficking policies in different states. According to the Office of Justice Programs website, “There may be subtle or large differences between state and federal laws, but they help victims of trafficking receive services from multiple providers and help law enforcement address these crimes at different levels.” If we are able to find enough relevant data and if time permits, we may try to provide more detailed information for each state based on their policies.

- FBI Data: https://ucr.fbi.gov/crime-in-the-u.s/2018/crime-in-the-u.s.-2018/additional-data-collections/human-trafficking
- CTDC Data: https://www.ctdatacollaborative.org/download-global-dataset
- Human trafficking laws resource: https://polarisproject.org/resources/state-ratings-on-human-trafficking-laws/

# Tasks:

Tasks include:
- using the visualization to explore U.S. human trafficking data,
- using the visualizationto find similarities/differences between human trafficking in different states
- visualizing distribution of human trafficking victims by age, sex, race, and ethnicity -- over time and by state
- visualizing variations of human trafficking victims by age, sex, race, and ethnicity  -- over time and by state
- identifying outliers, such as states with particularly high human trafficking numbers, or identifying states missing human trafficking data
- giving users an overview of US human trafficking data 
- helping users easily find and identify correlations between variables, i.e. whether there is a correlation between victim age and gender, between victim age and race, between victim age and ethnicity, between the state and number of victims, between state and age of its victims, between state and race of its victims, etc.  
- visualizing potential effects of various human trafficking policy implementations over time
- Presenting human trafficking enforcement data to relevant audiences (non-profits, policymakers, FBI units) in an easily digestible manner.  

We plan to incorporate a drop-down menu at the top of our visualization so that individuals can select and view state data by age, race, and gender.  Once selected, users will see a side-by-side bar chart (showing data per state in raw numbers) and a chart showing percentages of a whole.  

We expect our target users will use the visualization to compare the statistics of human trafficking in various states and how those numbers compare to those of other states.  We believe our target users can use this information to target potential policy initiatives for specific states, or specific populations of trafficking victims.   


## Tasks List:

- find similarities/differences between human trafficking in different states
- distribution of human trafficking victims by age, sex, race, and ethnicity -- over time and by state
- Identify outliers, such as states with particularly high human trafficking numbers, or identifying states missing human trafficking data
- identify correlations between variables, i.e. whether there is a correlation between victim age and gender, between victim age and race, between victim age and ethnicity, between the state and number of victims, between state and age of its victims, between state and race of its victims, etc.  
- isualizing potential effects of various human trafficking policy implementations over time
- resenting human trafficking enforcement data to relevant audiences (non-profits, policymakers, FBI units) in an easily digestible manner.  


# Process summary:

## Did we stick to our original plans?
The main purpose of our project remained the same throughout the deveopment process. Our intention was still to create a visualization that allows users to view the state of human trafficking as reported in FBI data throughout the United States, as well as to offer the ability to compare this data for specific states. We also chose to keep all four of the intial categories of data reported in the FBI daatabase: Age Group, Gender, Race, and Ethnicity. The overall structure and functionality of our visualization similarly stayed constant from the start. Our intention was to provide an overview of the whole country, with details on demand available on click, and this is what we developed.

Certain details of our visualization, however, were changed as we worked on deveoping our prototype. For the overview part of the visualization, we decided to use a map to visualize overall cases across the US. Initially, we had planned creating a bar graph or similar type of chart to display this data. We were unsure whether enough data had been reported to adequately fill a map, and we were also doubtful whether any meaningful geographic trends would emerge in the map. During our development process, however, we decided that a map would more easily allow users to visualize the differences between states and to interact with our visualization. The FBI also released additional data for the year 2019 which allowed us to more accurately complete the map. We also deliberated on what the best visualization method would be for the charts displaying detailed state data by category throughout the early stages of our development process. We decided to switch from our original intention of using bar charts to line graphs instead, as we believed line graphs would be more appropriate for visualizing data over time. While we kept the view-by-category option for the line graphs, we decided not to add this option to the map insufficient data was reported for each category.
## Were some parts harder, easier, or more time consuming than expected?
Although we initially felt intimidated by the idea of constructing a chloropleth map with our data, this part of the development process turned out to be easier than expected. It was a very successful first step in our prototype development, although we did have to make changes to it as we worked through the data wrangling process, which wa significantly more time consuming than expected. Filtering the data to fit the line graphs in our prototype was a surprisingly easy task once we had the data in the proper format. However, we experienced some difficulties linking the graph data to the map visalization appropriately. We had to work through several issues that occured in the graphs when selecting and unselecting states on the map. Some other tasks that proved to be more difficult than expected include creating the tooltip for the map and the legend for the line charts. We worked through these issues by troubleshooting as a team and also individually looking at examples of code for similar D3 visualizations online.
## Lessons Learned: Reflections on our project
As we began analyzing the FBI data through our visualization prototype and researching our topic, we learned some important lessons about human trafficking in the US. The main problem that we encountered during this project was the lack of reported data in the FBI database. This is a significant issue, because lack of reported data for various states can lead people to think that human trafficking is not a problem in those areas of the US, when in reality, this may not be the case. By researching the human trafficking policies of sates that showed unexplained spikes in human trafficking cases in our visualization, we realized that those spikes may exist due to states reporting their cases more accurately, rather than an actual increase in human trafficking. Comparing our visualization to other human trafficking visualizations on the web, we saw some similarities, but also significant differences in the prevalence of human trafficking across the US. This further validated our concern that human trafficking is not consistently reported by official sources.

In terms of the actual prototype development process, our biggest takeaway was probably the importance of data wrangling in preparation for building a prototype. We spent significant time reshaping our data from the multiple separate FBI spreadsheets released by year. Before the data was properly consolidated and organized, we had difficulties thinking of how we could incorporate the data into our code and how we should organize the code to fit the data. However, once we looked at similar examples and determined how the data should be structured, adding it into our visualization was not a problem anymore. Also, we found that defining the tasks and planning ahead was important as we determined how we want the visualization to look. At the same time, however, we felt that the visuzalization could be used to better understand the data and the story that it tells, which could in turn influence the visualization and tasks.

----------------------------------------------------------------------------------------------------------------------
# INFO ON EDITING

You can use the [editor on GitHub](https://github.com/micherjo/INLS641_HumanTrafficking/edit/gh-pages/index.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/micherjo/INLS641_HumanTrafficking/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
