import type { ShareTokenDto } from "@/models/trip/ShareTokenDto";

interface Props {
  shareToken: ShareTokenDto;
}

export default function ShareTokenDisplay({
  shareToken,
}: Props) {
  const copyLink = async () => {
    await navigator.clipboard.writeText(shareToken.link);
    alert("Link copied!");
  };

  return (
    <div className="mx-auto w-full max-w-5xl max-h-[90dvh] md:max-h-[95dvh] overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl max-h-[90dvh] md:max-h-[95dvh] overflow-y-auto"></div>
      <h3>Share generated QR code or link with person/people you want to have access to your trip plan!</h3>
      <img
        src={`data:image/png;base64,${shareToken.qrCodeBase64}`}
        alt="QR Code"
        className="mx-auto h-60 w-60 rounded-lg border"
      />

      <div className="w-full">
        <label className="mb-1 block text-sm font-medium">
          Share link
        </label>

        <div className="flex gap-2">
          <input
            readOnly
            value={shareToken.link}
            className="flex-1 rounded border px-3 py-2 bg-transparent"
          />

          <button
            onClick={copyLink}
            className="rounded bg-primary px-4 py-2 text-white"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}