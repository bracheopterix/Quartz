# Notes are for Mark's task
- A big data inside the container 
- It is separated in chunks, loaded just the one that is correlated to the scroll level, one before and one after.
- Other chunks are unmounted from the page.

/// Notes
//  The infinite scroll in the way it is existing now is eating all the CPU
//  The right way to do it - to have only some of them mounted
//  I believe it is done by Pages
//  But I still does not know how to unmount with smoothness
//  Or without all collapsing by the height of unexisting element
//  Maybe you don't have full scroll on the go
//  And the scrolling motion just changing the mounted page with some cool animation depending it went uo or down???
//  It would be cool for the book in sertar's style
//  