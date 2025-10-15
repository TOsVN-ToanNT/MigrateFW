/** 最終更新日 : 2016-10-17 **/
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using Tos.Web.Data;

namespace Tos.Web.Controllers
{
    public class SampleFixedController : ApiController
    {
        // GET api/<controller>/5
        public FixedMitsumoriResponse Get(int no_fixed)
        {
            SampleEntities context = new SampleEntities();

            var mitsumori = (from f in context.FixedMitsumori
                             where f.no_fixed == no_fixed  && !f.flg_del
                             select f).FirstOrDefault();

            if (mitsumori == null)
            {
                throw new HttpException((int)HttpStatusCode.NotFound, Properties.Resources.NoDataExsists);
            }

            var result = new FixedMitsumoriResponse();
            result.Header = mitsumori;

            List<FixedKentosho> kentosho = (from k in context.FixedKentosho
                                            where k.no_fixed == no_fixed
                                            select k).ToList();
            result.Detail.AddRange(kentosho);
            return result;
        }

        public class FixedMitsumoriResponse
        {
            public FixedMitsumoriResponse()
            {
                this.Header = new FixedMitsumori();
                this.Detail = new List<FixedKentosho>();
            }

            public FixedMitsumori Header { get; set; }
            public List<FixedKentosho> Detail { get; set; }
        }


        private Mitsumori FlattenMitsumori(FixedMitsumori value)
        {
            return new Mitsumori()
            {
                cd_torihiki = value.cd_torihiki,
                cd_shiharai = value.cd_shiharai,
                nm_hinmei = value.nm_hinmei,
                biko = value.biko,
                dt_create = value.dt_create,
                cd_create = value.cd_create,
                dt_update = value.dt_update,
                cd_update = value.cd_update,
                flg_del = value.flg_del
            };
        }

        private ICollection<Kentosho> FlattenKentosho(List<FixedKentosho> list)
        {

            ICollection<Kentosho> kentosho = new List<Kentosho>();

            foreach (FixedKentosho item in list)
            {
                kentosho.Add(new Kentosho()
                    {
                        no_komoku = item.no_komoku,
                        cd_buhin = item.cd_buhin,
                        nm_komoku = item.nm_komoku,
                        su_suryo = item.su_suryo,
                        kin_shiire_tanka = item.kin_shiire_tanka
                    }
                );
            }

            return kentosho;
        }
    }
}
