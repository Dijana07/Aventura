using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs
{
    public class ShareTokenDto
    {
        public string Link { get; set; } = string.Empty;

        public string QrCodeBase64 { get; set; } = string.Empty;

        public ShareTokenDto() { }
    }
}
