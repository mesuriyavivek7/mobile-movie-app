import { View, Text , Image, FlatList, ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '@/constants/images'
import MovieCard from '@/components/MovieCard'
import useFetch from '@/services/useFetch'
import { fetchMovies } from '@/services/api'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'
import { updateSearchCount } from '@/services/appwrite'

const search = () => {

  const [searchQuery,setSearchQuery] = useState('')

  const {data: movies, 
    loading: moviesLoading , 
    error: moviesError,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({query:searchQuery}),false)

  const [numColumns,setNumColumns] = useState(3)

   useEffect(()=>{

    const timeoutId = setTimeout(async () =>{
     if(searchQuery.trim()){
       await loadMovies();

       if(movies?.length > 0 && movies?.[0]){
        console.log('search query---->',searchQuery)
        await updateSearchCount(searchQuery, movies[0]);
       }

     } else{
       reset()
     }
    },500)

    return () => clearTimeout(timeoutId)
   },[searchQuery])

  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='w-full absolute flex-1 z-0' resizeMode='cover'></Image>

      <FlatList
      data={movies}
      renderItem={({item}) => <MovieCard {...item}></MovieCard> }
      keyExtractor={(item) => item.id.toString()}
      className='px-5'
      numColumns={numColumns}
      columnWrapperStyle={{
         justifyContent:'center',
         gap:16,
         marginVertical:16
       }}
       contentContainerStyle={{paddingBottom:100}}
       ListHeaderComponent={
        <> 
         <View className='w-full flex-row justify-center mt-20 items-center'>
           <Image source={icons.logo} className='w-12 h-10'></Image>
         </View>
         <View className='my-5'>
           <SearchBar placeholder='Search movies...' value={searchQuery} onChangeText={(text: string)=> setSearchQuery(text)}></SearchBar>
         </View>
        {
           (moviesLoading && 
           <ActivityIndicator size={'large'} color={"#0000ff"} className='my-3' />)
        }
        {
           (moviesError && (
              <Text className='text-red-500 px-5 my-3'>
                 Error while fetching movie data
              </Text>
           ))
         }
         {
          !moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
            <Text className='text-xl text-white font-bold'>
               Search Result for{' '}
               <Text className='text-accent'>{searchQuery}</Text>
            </Text>
          )
         }
        </>
       }
      ListEmptyComponent={
        !moviesLoading && !moviesError ? (
          <View className='mt-10 px-5'>
             <Text className='text-center text-gray-500'>
               {searchQuery.trim() ? "No movies found" : "Search for movie"}
             </Text>
          </View>
        ) : null
      }
      ></FlatList>
    </View>
  )
}

export default search