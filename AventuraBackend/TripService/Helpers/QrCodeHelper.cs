using QRCoder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripService.Helpers
{
    public static class QrCodeHelper
    {
        public static string GenerateQrBase64(string content)
        {
            using var qrGenerator = new QRCodeGenerator();

            var qrData = qrGenerator.CreateQrCode(
                content,
                QRCodeGenerator.ECCLevel.Q);

            var pngQr = new PngByteQRCode(qrData);

            var qrBytes = pngQr.GetGraphic(20);

            return Convert.ToBase64String(qrBytes);
        }
    }
}
