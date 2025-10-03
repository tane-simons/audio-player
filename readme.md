# Rationale
## Link
[GitHub Pages](https://tane-simons.github.io/audio-player/)

## Initial Ideation
The NFSA featured three main media types: audio, video, and images. As having not worked with audio yet, the decision was made to make it the primary focus of the site. Creating an audio player would be a unique process and a require limiting control over data that is presented.

The 'digital flaneur' (Dörk et al., 2011) appeared in research and provided the foundation for the site's design, influencing its minimalism, lack of search, and encouragement to 'wander' through the selections.

## Prototyping
The prototyping of the site was completed in Figma displaying layout, type, functionality, and responsive design. The final site evidently resembled the prototype, differing primarily in the sizing of particular elements, as the inital prototype did not account for the extent that the dynamic data would influence the layout – especially long song titles.

Mobile view had smaller differences, as the prototype had a slider that was unnecessarily small – considering the desktop counterpart worked well and allowed for a larger target. Additionally, the info icon was implemented next to the title and not off to the side – maintaining an even visual weight and similarity with desktop.

## Development
### API Functionality
The use of the NFSA's API allowed for the sourcing of the audio and its metadata by altering the URL requested:
`https://api.collection.nfsa.gov.au/search?query=&hasMedia=yes&mediaFileTypes=Audio&forms=Music&parentTitle.genres=${genre}%20music&year=${year}-${Number(year)+9}`.  
This request allowed matches that had media and was of type audio, particularly music. Through JS, the user may adjust the genre and decade request which passes the decade as the lower bound and decade plus nine for the upper bound. To access the audio file itself, filePath had to be accessed and inserted into the media.nfsa url:  
`https://media.nfsacollection.net/${audioPath}`. 

In order to provide a link to the source in a user-friendly manner, the data.id was appended to the user-facing page of the NFSA:  
`https://www.collection.nfsa.gov.au/title/${id}`

### Responsiveness
Responsiveness on the site was achieved through relative sizing and break points. The text was adjusted using clamp(), allowing minimum, variable, and maximum sizes of the text – necessary as text became too small and large on certain screenwidths. Elements were responsively adjusted through percentages and viewport sizings, with static size elements using rem. At 580px the desktop view of the site becomes too small to reasonably display the content at which a breakpoint was created, changing to a vertically stacked mobile view with all the same elements and controls in order to maintain feature parity and familiarity.

### Other Features
The slider was created using the default html `<slider>` element which could be styled and utilised as necessary. The decade text is calculated and updates with the thumb's position. The slider and genre selection are both linked directly to the API call to update it whenever either is changed.

The custom-designed spinning record used JS to alter rotation and added easing of movement in/out upon the play/pause trigger. The record arm uses a similar technique, adding visual flair and feedback that something is playing.

## Reflection
The site was adjusted after considering feedback from code review and suggestions from others. This included the addition of the spinning record and arm which enhanced the overall design. Additionally, after constructive discussion and debate regarding how limited the user control should be, the queueing system achieved a compromise that retained the 'digital flaneur' style whilst allowing for small amounts of control like skipping songs.

Ideally future iterations would see a more thorough catalogue or selection in order to reduce the amount of 'collection incomplete's that occur as it interrupts the experience. Further adjustments could also be made to the sizing of elements, however, user testing would be beneficial to explore this.

## References
Dörk, M., Carpendale, S., & Williamson, C. (2011). The Information Flaneur: A Fresh Look at Information Seeking. https://mariandoerk.de/informationflaneur/chi2011.pdf