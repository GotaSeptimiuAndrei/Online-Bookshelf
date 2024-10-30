import React, { useEffect, useReducer } from 'react'
import { fetchCategories } from '../services/api'
import { CategoryProps } from '../types/CategoryProps'
import { ActionProps } from '../types/ActionProps'

export interface CategoriesState {
    categories?: CategoryProps[]
    fetching: boolean
    fetchingError?: Error | null
}

const initialState: CategoriesState = {
    fetching: false,
}

const reducer = (
    state: CategoriesState,
    action: ActionProps
): CategoriesState => {
    switch (action.type) {
        case 'FETCH_CATEGORIES_STARTED':
            return { ...state, fetching: true, fetchingError: null }
        case 'FETCH_CATEGORIES_SUCCEEDED':
            return {
                ...state,
                categories: action.payload.categories,
                fetching: false,
            }
        case 'FETCH_CATEGORIES_FAILED':
            return {
                ...state,
                fetchingError: action.payload.error,
                fetching: false,
            }
        default:
            return state
    }
}

export const CategoryContext =
    React.createContext<CategoriesState>(initialState)

interface CategoryProviderProps {
    children: React.ReactNode
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { categories, fetching, fetchingError } = state

    useEffect(() => {
        fetchCategoriesEffect()
    }, [])

    const fetchCategoriesEffect = async () => {
        dispatch({ type: 'FETCH_CATEGORIES_STARTED' })
        try {
            const categories = await fetchCategories()
            dispatch({
                type: 'FETCH_CATEGORIES_SUCCEEDED',
                payload: { categories },
            })
        } catch (error) {
            dispatch({
                type: 'FETCH_CATEGORIES_FAILED',
                payload: { error: error as Error },
            })
        }
    }

    const value = {
        categories,
        fetching,
        fetchingError,
    }

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    )
}
