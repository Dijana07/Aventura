using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs
{
    [DataContract]
    public class UploadedFileDto
    {
        [DataMember]
        public byte[] Data { get; set; } = [];

        [DataMember]
        public string FileName { get; set; } = string.Empty;

        [DataMember]
        public string ContentType { get; set; } = string.Empty;
    }
}
