
import {verticalSum,horizontalSum} from 'lib/utils/calculation'

describe("Number calculations",()=>{
  it("should sum all numbers for each column",()=>{
    expect(verticalSum([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])).toEqual([15,18,21,24])
  })

  it("should sum all numbers for each row",()=>{
    expect(horizontalSum([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])).toEqual([10,26,42])
  })
})
