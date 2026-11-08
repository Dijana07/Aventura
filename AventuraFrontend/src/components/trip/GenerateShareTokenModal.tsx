import { useState } from "react";
import { tripService } from "@/services/tripService";
import { AccessType } from "@/enums/AccessType";
import type { ShareTokenDto } from "@/models/trip/ShareTokenDto";
import type { CreateShareTokenRequest } from "@/models/trip/CreateShareTokenRequest";
import ShareTokenDisplay from "./ShareTokenDisplay";
import { validateCreateShareToken } from "@/validators/shareValidator";

interface Props {
  tripId: string;
  onClose: () => void;
}

export default function GenerateShareTokenModal({
  tripId,
  onClose,
}: Props) {
  const [email, setEmail] = useState("");
  const [accessType, setAccessType] = useState<AccessType>(AccessType.VIEW);
  const [shareToken, setShareToken] = useState<ShareTokenDto>();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);

    try {
      const request: CreateShareTokenRequest = {
        tripId,
        allowedUserEmail:
          email.trim() || undefined,
        accessType,
      };

      const error = validateCreateShareToken(request);
      if (error)
      {
        setIsLoading(false);
        alert(error);
        return;
      }

      const response = await tripService.createOrGetShareToken(request);

      if (response.success && response.data) {
        setShareToken(response.data);
      }

      alert(response.message);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-xl rounded-lg bg-background-100 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-2 text-3xl"
        >
          ×
        </button>

        <h2 className="mb-6 text-2xl font-semibold">
          Share trip
        </h2>

        {shareToken ? (
          <ShareTokenDisplay
            shareToken={shareToken}
          />
        ) : (
            <div className="space-y-4">
            <div>
                <label className="mb-1 block">
                Allowed user email
                </label>

                <input
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
                placeholder="Leave empty for anyone"
                className="w-full rounded border px-3 py-2 bg-transparent"
                />
            </div>

            <div>
                <label className="mb-1 block">
                Access type
                </label>

                <select
                value={accessType}
                onChange={(e) =>
                    setAccessType(
                    e.target.value as typeof AccessType[keyof typeof AccessType]
                    )
                }
                className="w-full rounded border px-3 py-2 bg-transparent"
                >
                <option value={AccessType.VIEW} className="bg-transparent">
                    View
                </option>

                <option value={AccessType.EDIT} className="bg-transparent">
                    Edit
                </option>
                </select>
            </div>

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="rounded bg-green-800 px-4 py-2 text-white"
            >
                {isLoading
                ? "Generating..."
                : "Generate link"}
            </button>
            </div>
        )}
      </div>
    </div>
  );
}