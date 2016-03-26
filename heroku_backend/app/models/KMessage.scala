package models

/**
 * Created by amy on 24/01/2016.
 */
class KMessage (id: Long, content: String) {
    def getID: Long = {
      return id
    }

    def getContent: String = {
      return content
    }
}
