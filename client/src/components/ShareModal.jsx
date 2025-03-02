import { Share2, MapPin } from "lucide-react"
import { WhatsappShareButton, WhatsappIcon } from "react-share"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Card, CardContent } from "./ui/card"

const ShareModal = ({ username, score, open, onClose }) => {
  const shareUrl = `${window.location.origin}${
    window.location.pathname
  }?inviter=${encodeURIComponent(username)}&correct=${
    score.correct
  }&incorrect=${score.incorrect}`
  const shareMessage = `🌍 I scored ${score.correct} correct answers in Globetrotter! Can you beat my score? Play now!`

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">
            Challenge Your Friends!
          </DialogTitle>
          <p className="text-muted-foreground">
            Share your score and see if your friends can beat it!
          </p>
        </DialogHeader>

        <Card className=" border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-blue-500" size={24} />
              <h3 className="text-lg font-bold">Globetrotter</h3>
            </div>
            <p>
              <span className="font-bold">{username}</span> has challenged you
              to beat their score!
            </p>
            <div className="flex justify-center gap-8 my-4">
              <div className="text-center">
                <span className="block text-green-500 font-bold text-xl">
                  {score.correct}
                </span>
                <span className="text-sm text-gray-700">Correct</span>
              </div>
              <div className="text-center">
                <span className="block text-red-500 font-bold text-xl">
                  {score.incorrect}
                </span>
                <span className="text-sm text-gray-700">Incorrect</span>
              </div>
            </div>
            <p className="text-center text-blue-600 font-medium">
              Click to play and see if you can do better!
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 mt-4">
          <WhatsappShareButton url={shareUrl} title={shareMessage}>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 p-2 rounded-full">
                <WhatsappIcon size={32} round />
              </div>
              <span className="text-sm text-gray-800">WhatsApp</span>
            </div>
          </WhatsappShareButton>

          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl)
              alert("Link copied to clipboard!")
            }}
            className="flex flex-col items-center"
          >
            <div className="bg-blue-500 p-3 rounded-full text-white">
              <Share2 size={24} />
            </div>
            <span className="text-sm text-gray-800">Copy Link</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareModal
