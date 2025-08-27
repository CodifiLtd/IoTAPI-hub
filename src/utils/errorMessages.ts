// https://github.com/yousefhany77/prisma-better-errors
export const prismaErrorMessages: Record<
  string,
  { status: number; message: string } | undefined
> = {
  P2000: {
    status: 400,
    message:
      "The provided value for the column is too long for the column's type"
  },
  P2001: {
    status: 404,
    message: 'The record searched for in the where condition does not exist'
  },
  P2002: { status: 409, message: 'Unique constraint failed' },
  P2003: { status: 409, message: 'Foreign key constraint failed' },
  P2004: { status: 400, message: 'A constraint failed on the database' },
  P2005: {
    status: 400,
    message:
      "The value stored in the database for the field is invalid for the field's type"
  },
  P2006: {
    status: 400,
    message: 'The provided value for the field is not valid'
  },
  P2007: { status: 400, message: 'Data validation error' },
  P2008: { status: 400, message: 'Failed to parse the query' },
  P2009: { status: 400, message: 'Failed to validate the query' },
  P2010: { status: 500, message: 'Raw query failed' },
  P2011: { status: 400, message: 'Null constraint violation' },
  P2012: { status: 400, message: 'Missing a required value' },
  P2013: { status: 400, message: 'Missing a required argument' },
  P2014: {
    status: 400,
    message:
      'The change you are trying to make would violate the required relation'
  },
  P2015: { status: 404, message: 'A related record could not be found' },
  P2016: { status: 400, message: 'Query interpretation error' },
  P2017: {
    status: 400,
    message:
      'The records for relation between the parent and child models are not connected'
  },
  P2018: {
    status: 404,
    message: 'The required connected records were not found'
  },
  P2019: { status: 400, message: 'Input error' },
  P2020: { status: 400, message: 'Value out of range for the type' },
  P2021: {
    status: 404,
    message: 'The table does not exist in the current database'
  },
  P2022: {
    status: 404,
    message: 'The column does not exist in the current database'
  },
  P2023: { status: 400, message: 'Inconsistent column data' },
  P2024: {
    status: 500,
    message: 'Timed out fetching a new connection from the pool'
  },
  P2025: {
    status: 404,
    message:
      'An operation failed because it depends on one or more records that were required but not found'
  },
  P2026: {
    status: 400,
    message:
      "The current database provider doesn't support a feature that the query used"
  },
  P2027: {
    status: 500,
    message: 'Multiple errors occurred on the database during query execution'
  }
};
