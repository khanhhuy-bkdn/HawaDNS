using System.Collections.Generic;

namespace _Dtos.IC.InputDtos
{
    public class DataLocationJsonDto
    {
        public DataLocationForestPlotDto[] Features { get; set; }
    }

    public class DataLocationForestPlotDto
    {
        public string Type { get; set; }

        public DataLocationForestPlotPropertyDto Properties { get; set; }

        public DataLocationForestPlotGeometry Geometry { get; set; }
    }

    public class DataLocationForestPlotGeometry
    {
        public string Type { get; set; }

        public decimal[] Coordinates { get; set; }
    }

    public class DataLocationForestPlotPropertyDto
    {
        public string Plot_uuid { get; set; }

        public string Commune_co { get; set; }

        public string Compt_code { get; set; }

        public string Sub_compt_ { get; set; }

        public string Plot_code { get; set; }
    }

    public class DataResultDto
    {
        public List<string> BadFile { get; set; }

        public List<string> BadForestPlotCode { get; set; }

        public DataAmountResultDto[] Result { get; set; }
    }

    public class DataAmountResultDto
    {
        public string Name { get; set; }

        public decimal DataDBAmount { get; set; }

        public decimal DataInputAmount { get; set; }
    }
}