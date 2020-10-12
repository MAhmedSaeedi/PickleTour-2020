import React, { useEffect } from 'react'
import { View, Text,FlatList, Image } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { recipesSelector, fetchRecipes } from '../store/slices/recipes'

export default function TestLogin() {
    const { recipes, loading, hasErrors } = useSelector(recipesSelector)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(fetchRecipes())
    },[dispatch])

    
    return (
        <View>
            {loading && <Text>Loading</Text>}
            {hasErrors && <Text>Error has occured</Text>}
            <FlatList
                data={recipes}
                key={recipes.idMeal}
                renderItem={({item})=>(
                    <Image key={item.idMeal} source={{uri:item.strMealThumb}} style={{width:100, height:100}}/>
                )}
            />
        </View>
    )
}
