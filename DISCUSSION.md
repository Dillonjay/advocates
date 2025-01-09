# Overview

First off, I want to say that I had a good time working on this and thank you for the opportunity!

For this project, I focused on building something functional and user-friendly. My priority was to make sure that the feature worked well for users, even if that meant handling filtering and searching on the frontend. With more time, I would shift my efforts to optimizing the backend as this solution won't scale.

## Trade Offs

I chose to focus my efforts on the frontend this time for the following reasons:

1. **Immediate value**: Since it was a lower lift, it could get into the hands of users sooner for testing and feedback. A product isn’t valuable unless users can interact with it.
2. **Efficiency**: Since I was already working on the UI, implementing and testing filters on the frontend was the quickest way to get things functioning with the time constraint.

## Next Steps for Frontend

#### Short Term Improvements

1. Add sorting to the table.
2. Make the table more interactive:
   - Let users toggle visible columns.
   - Show expanded details for advocates in a more interactive card or modal view. Things like contact details, photos maybe, availability etc. Specialities could be displayed as tags.
3. Add pagination for larger datasets.
4. Persist filters and search terms in the URL for sharing and bookmarking.
5. Improve accessibility with focus states and keyboard navigation. I'd opt for something like HeadlessUI or Radix.
6. Make the refinement hook a bit more generic. The years of expierence filter options are passed around more than I'd like and feel like a one off thing.
7. Create a generic table which could work with the hooks. The table could include refinements, and pagination triggers for calling the advocate API with filter, search, and query options.
8. Narrow down existing filters that don't return a result in combination with active filters.
9. I'd probably want to use React Query.
10. Add a favorite advocates feature.
11. Introduce an interactive map of where advocates are located.

## Next Steps for Backend

Moving the filtering and searching logic to the backend would be my next priority as it would scale and perform much better:

1. Implement server side pagination to reduce payload size the more realistic dataset.
2. Add query based filtering and searching.
3. Add the abilty to sort with and order query string.
4. Look into adding a rate limit to avoid overloading our API/DB.
5. Indexing frequently queried fields.
6. Use a shared schema to give a contract and ensure consistency between the frontend and backend.

Ideally, I would use something like TypeORM to help with constructing some of these queries. For example a request like this: `/api/advocates?city=Austin&page=2&limit=20&sort=yearsOfExperience&order=desc` could generate something like this:

```
  const queryBuilder = repository.createQueryBuilder("advocate");
  if (city) {
   queryBuilder.andWhere("advocate.city = :city", { city });
  }
  queryBuilder.orderBy(`advocate.${sort}`, order.toUpperCase());
  queryBuilder.skip((page - 1) * limit).take(limit);
```

## Scalability and Testing

Other things I might look at for a project like this are:

1. Validing filters that are actually valuable to users via user testing.
2. Unit, integration, and e2e testing.
3. Look into integrating with a search engine such as Algolia or ElasticSearch
4. Explore caching layers like Redis for frequently queried data.
5. Setting up an anlytics service such as Heap, GA, or MixPanel.
