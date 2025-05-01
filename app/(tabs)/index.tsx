import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrandingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, Image, ScrollView, ActivityIndicator, FlatList } from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError
  } = useFetch(getTrandingMovies)

  const {data: movies, 
    loading: moviesLoading , 
    error: moviesError} = useFetch(() => fetchMovies({query:''}))

  const [numColumns,setNumColumns] = useState(3)

  return (
    <View
    className="flex-1 bg-primary"
    >
       <Image source={images.bg} className="absolute w-full"></Image>
       <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight:'100%',paddingBottom:10}}>
         <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto"></Image>
         {
          moviesLoading || trendingLoading ? (
             <ActivityIndicator
             size={'large'}
             color="#0000ff"
             className="mt-10 self-center"
             ></ActivityIndicator>
          ) : moviesError || trendingError ? (
             <Text>Error: {moviesError?.message || trendingError?.message}</Text>
          ) :
          (
            <View className="flex-1 mt-5">
              <SearchBar onPress={()=> router.push("/search")} placeholder="Search for a movie"></SearchBar>

              {
                trendingMovies && (
                  <View className="mt-10">
                    <Text className="text-lg text-white font-bold mt-5 mb-3">Trending Movies</Text>

                    <FlatList
                     horizontal
                     showsHorizontalScrollIndicator={false}
                     ItemSeparatorComponent={()=> <View className="w-4"></View>}
                     className="mb-4 mt-3 "
                     data={trendingMovies} 
                     renderItem={({item, index}) =>(
                      <TrendingCard movie={item} index={index}></TrendingCard>
                     )}
                     keyExtractor={(item) => item.movie_id.toString()}
                    ></FlatList>

                  </View>
                )
              }

              <>
                <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>

                <FlatList
                key={numColumns}
                data={movies}
                renderItem={({item})=>(
                  <MovieCard {...item}></MovieCard>
                )}
                keyExtractor={(item)=> item.id.toString()}
                numColumns={numColumns}
                columnWrapperStyle={{
                  justifyContent:'flex-start',
                  gap:15,
                  paddingRight:5,
                  marginBottom:10
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
                ></FlatList>

              </>
            </View>
          )
         }

       </ScrollView>
    </View>
  );
}
