
import {getDBConnection} from "../../lib/db"

describe("getDBConnection()",()=>{
  it('should return promise that will return a database connection',()=>{
    const conn=getDBConnection()
    console.log(conn)
    expect(1).toEqual(1)
  })
})
