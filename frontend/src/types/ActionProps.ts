import { BookProps } from './BookProps'
import { CategoryProps } from './CategoryProps.ts'

export interface FetchBooksStartedAction {
    type: 'FETCH_BOOKS_STARTED'
}

export interface FetchBooksSucceededAction {
    type: 'FETCH_BOOKS_SUCCEEDED'
    payload: {
        books: BookProps[]
    }
}

export interface FetchBooksFailedAction {
    type: 'FETCH_BOOKS_FAILED'
    payload: {
        error: Error
    }
}

export interface FetchCategoriesStartedAction {
    type: 'FETCH_CATEGORIES_STARTED'
}

export interface FetchCategoriesSucceededAction {
    type: 'FETCH_CATEGORIES_SUCCEEDED'
    payload: {
        categories: CategoryProps[]
    }
}

export interface FetchCategoriesFailedAction {
    type: 'FETCH_CATEGORIES_FAILED'
    payload: {
        error: Error
    }
}

export type ActionProps =
    | FetchBooksStartedAction
    | FetchBooksSucceededAction
    | FetchBooksFailedAction
    | FetchCategoriesStartedAction
    | FetchCategoriesSucceededAction
    | FetchCategoriesFailedAction
