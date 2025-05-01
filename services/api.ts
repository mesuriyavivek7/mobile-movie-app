export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY:process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

export const fetchMovies = async ({ query }: {query:string}) => {
    const endPoint = query ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`

    const response = await fetch(endPoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers
    })

    if(!response.ok){
        throw new Error("Failed to fetch movies")
    }

    const data = await response.json()

    return data.results
}

// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZGRmY2I4M2U1Mjc2NTkxNDMwNjUyYmU1NGIwNTk1ZSIsIm5iZiI6MTc0NTkwOTMzMC4wOSwic3ViIjoiNjgxMDc2NTIwYzEyNWE5NTUzMGZjZmZlIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.vM92ZvGJcuMZ8BXn1K3RXqo50aGiLdMBxcRzyHJEu7A'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));